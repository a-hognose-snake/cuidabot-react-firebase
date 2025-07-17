import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getKnowledgeBase, updateKnowledgeBase } from '../../services/firestoreService';
import { Save, AlertCircle } from 'lucide-react';

export default function KnowledgeBaseEditor() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const kbContent = await getKnowledgeBase();
        setContent(kbContent);
      } catch (err) {
        setError('No se pudo cargar la base de conocimiento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledge();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateKnowledgeBase(content);
      setSuccess('¡Base de conocimiento guardada con éxito!');
      setTimeout(() => setSuccess(''), 3000); // Ocultar mensaje después de 3 segundos
    } catch (err) {
      setError('Error al guardar. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Cargando base de conocimiento...</div>;
  }

  return (
    <div className="admin-panel-container">
      <div className='admin-panel-header'>
        <h1>Editar Base de Conocimiento del Chatbot</h1>
        <Link to="/dashboard" className="btn btn-secondary">Volver al Panel</Link>
      </div>

      <div className="editor-card data-card">
        <div className="editor-info">
          <AlertCircle size={20} />
          <p>Edita el texto a continuación para cambiar lo que el chatbot sabe. El formato es importante: mantén las líneas "Categoría:", "Pregunta:" y "Respuesta:".</p>
        </div>
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={25}
        />
        <div className="editor-actions">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
