// src/pages/admin/FaqsEditor.jsx
import React, { useState, useEffect } from 'react';
import { getFaqs, addFaq, updateFaq, deleteFaq } from '../../services/firestoreService'; // You'll need to add these to firestoreService.js
import { PlusCircle, Edit, Trash2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FaqsEditor() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State for form inputs (for adding/editing)
  const [currentFaqId, setCurrentFaqId] = useState(null); // null for new, ID for editing
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setsubcategory] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setCurrentFaqId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || ''); // Ensure category and subcategory exist
    setsubcategory(faq.subcategory || '');
    // Scroll to form or highlight it for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await deleteFaq(id); // Implement this in firestoreService.js
        setSuccessMessage('FAQ deleted successfully!');
        fetchFaqs(); // Re-fetch FAQs to update the list
      } catch (err) {
        console.error('Error deleting FAQ:', err);
        setError('Failed to delete FAQ. Please try again.');
      } finally {
        setTimeout(() => setSuccessMessage(''), 3000);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!question.trim() || !answer.trim() || !category.trim()) {
      setError('Question, answer, and category cannot be empty.');
      return;
    }

    const faqData = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      subcategory: subcategory.trim(),
      // You might want to add a timestamp here
      createdAt: currentFaqId ? faqs.find(f => f.id === currentFaqId)?.createdAt : new Date(),
      updatedAt: new Date()
    };

    try {
      if (currentFaqId) {
        await updateFaq(currentFaqId, faqData); // Implement this in firestoreService.js
        setSuccessMessage('FAQ updated successfully!');
      } else {
        await addFaq(faqData); // Implement this in firestoreService.js
        setSuccessMessage('FAQ added successfully!');
      }
      resetForm();
      fetchFaqs(); // Re-fetch FAQs to update the list
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError('Failed to save FAQ. Please try again.');
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setCurrentFaqId(null);
    setQuestion('');
    setAnswer('');
    setCategory('');
    setsubcategory('');
  };

  if (loading) {
    return <div className="loading-indicator">Cargando preguntas frecuentes...</div>;
  }

  // Group FAQs by category and then subcategory for display
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = {};
    }
    if (!acc[faq.category][faq.subcategory || 'No subcategory']) {
      acc[faq.category][faq.subcategory || 'No subcategory'] = [];
    }
    acc[faq.category][faq.subcategory || 'No subcategory'].push(faq);
    return acc;
  }, {});


  return (
      <div className="admin-panel-container">
            <div className='admin-panel-header'>
              <h1>Editor de Preguntas Frecuentes</h1>
              <Link to="/dashboard" className="btn btn-secondary">Volver al Panel</Link>
            </div>

      <div className="data-card editor-card">
        <div className="editor-info">
          <Info size={20} />
          <p>
            Aquí puedes añadir, editar o eliminar preguntas frecuentes.
            Asegúrate de que la categoría sea consistente para agrupar preguntas.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form"> {/* Reusing auth-form styles */}
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="form-input"
              placeholder="Ej: Admisión, Horarios, Servicios"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subcategory">Sub-categoría</label>
            <input
              id="subcategory"
              type="text"
              value={subcategory}
              onChange={(e) => setsubcategory(e.target.value)}
              className="form-input"
              placeholder="Ej: Requisitos, Contacto"
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Pregunta</label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="form-input"
              placeholder="Ej: ¿Cuáles son los horarios de atención?"
            />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Respuesta</label>
            <textarea
              id="answer"
              rows="5"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="form-input editor-textarea" // Combining form-input with editor-textarea for specific sizing
              placeholder="Escribe la respuesta completa aquí."
            ></textarea>
          </div>
          <div className="editor-actions">
            {currentFaqId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar Edición
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {currentFaqId ? 'Actualizar FAQ' : 'Añadir FAQ'}
            </button>
          </div>
        </form>
      </div>

      <h2 className="mt-4">Preguntas Frecuentes Existentes</h2>
      {Object.keys(groupedFaqs).length === 0 ? (
        <p className="text-center">No hay preguntas frecuentes para mostrar.</p>
      ) : (
        Object.entries(groupedFaqs).map(([categoryName, subCategories]) => (
          <div key={categoryName} className="faq-category data-card editor-card mt-4">
            <h2>{categoryName}</h2>
            {Object.entries(subCategories).map(([subcategoryName, faqsInsubcategory]) => (
              <div key={subcategoryName} className="faq-subcategory">
                {subcategoryName !== 'No subcategory' && <h3>{subcategoryName}</h3>}
                {faqsInsubcategory.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <span>{faq.question}</span>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="btn-icon btn-view"
                          title="Editar FAQ"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="btn-icon btn-danger"
                          title="Eliminar FAQ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}