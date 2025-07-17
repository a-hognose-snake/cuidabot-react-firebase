import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSurveyResponses, deleteSurveyResponse } from '../../services/firestoreService';
import { Trash2, Eye } from 'lucide-react';

// Modal to view the full details of a single survey response
const ViewResponseModal = ({ response, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Detalle de Respuesta</h3>
      <div className="response-details">
        <p><strong>Usuario ID:</strong> {response.userId}</p>
        <p><strong>Fecha:</strong> {new Date(response.submittedAt.seconds * 1000).toLocaleString()}</p>
        <hr />
        <p><strong>Edad:</strong> {response.age}</p>
        <p><strong>Escolaridad:</strong> {response.education}</p>
        <p><strong>Parentesco:</strong> {response.relationship}</p>
        <p><strong>Días usando la plataforma:</strong> {response.daysUsingPlatform}</p>
        <hr />
        <p><strong>Facilidad de uso:</strong> {response.easeOfUse}/7</p>
        <p><strong>Relevancia de la información:</strong> {response.infoRelevance}/7</p>
        <p><strong>Impacto en el cuidado:</strong> {response.careImpact}/7</p>
        <p><strong>Satisfacción general:</strong> {response.overallSatisfaction}/7</p>
      </div>
      <div className="modal-actions">
        <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
      </div>
    </div>
  </div>
);

export default function SurveyResponses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const responseList = await getAllSurveyResponses();
        setResponses(responseList);
      } catch (error) {
        console.error("Error fetching survey responses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  const handleDelete = async (responseId) => {
    // Optional: Add a confirmation modal here as well
    if (window.confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
      try {
        await deleteSurveyResponse(responseId);
        setResponses(responses.filter(res => res.id !== responseId));
      } catch (error) {
        console.error("Error deleting survey response: ", error);
      }
    }
  };

  if (loading) {
    return <div className="loading-indicator">Cargando Respuestas...</div>;
  }

  return (
    <>
      {selectedResponse && <ViewResponseModal response={selectedResponse} onClose={() => setSelectedResponse(null)} />}
      <div className="admin-panel-container">
        <div className='admin-panel-header'>
          <h1>Respuestas de la Encuesta</h1>
          <Link to="/dashboard" className="btn btn-secondary">Volver al Panel</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Satisfacción General</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {responses.map(res => (
                <tr key={res.id}>
                  <td>{new Date(res.submittedAt.seconds * 1000).toLocaleDateString()}</td>
                  <td>{res.userId.substring(0, 10)}...</td>
                  <td>{res.overallSatisfaction} / 7</td>
                  <td className="actions-cell">
                    <button onClick={() => setSelectedResponse(res)} className="btn-icon btn-view">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(res.id)} className="btn-icon btn-danger">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
