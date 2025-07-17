import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFaqs } from '../../services/firestoreService';
import { ChevronDown } from 'lucide-react';

// Componente para una sola pregunta y respuesta (acordeón)
const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{faq.question}</span>
        <ChevronDown className={`faq-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FaqPage() {
  const [faqs, setFaqs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqList = await getFaqs();
        // Agrupar las preguntas por categoría y subcategoría
        const groupedFaqs = faqList.reduce((acc, faq) => {
          const { category, subcategory } = faq;
          if (!acc[category]) {
            acc[category] = {};
          }
          if (!acc[category][subcategory]) {
            acc[category][subcategory] = [];
          }
          acc[category][subcategory].push(faq);
          return acc;
        }, {});
        setFaqs(groupedFaqs);
      } catch (error) {
        console.error("Error fetching FAQs: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return <div className="loading-indicator">Cargando preguntas...</div>;
  }

  return (
    <div className="user-panel-container">
      <div className="user-panel-header">
        <h1>Preguntas Frecuentes</h1>
        <Link to="/dashboard" className="btn btn-secondary">Volver al Panel</Link>
      </div>
      
      <div className="data-card editor-card">
        {Object.keys(faqs).map(category => (
          <div key={category} className="faq-category">
            <h2>{category}</h2>
            {Object.keys(faqs[category]).map(subcategory => (
              <div key={subcategory} className="faq-subcategory">
                <h3>{subcategory}</h3>
                {faqs[category][subcategory].map(faq => (
                  <FaqItem key={faq.id} faq={faq} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
