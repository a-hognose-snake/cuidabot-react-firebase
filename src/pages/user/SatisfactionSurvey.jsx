// Import necessary hooks and components from React and other libraries.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Custom hook to get user info.
import { saveSurveyResponse } from '../../services/firestoreService'; // Service to save data.
import { ArrowLeft } from 'lucide-react'; // Icon for the back button.

// --- DATA FOR THE DROPDOWN MENUS ---
// Array of education levels for the select input.
const educationLevels = [
  "Sin educación formal",
  "Educación básica incompleta",
  "Educación básica completa",
  "Educación media incompleta",
  "Educación media completa",
  "Educación técnico‑profesional (media)",
  "Educación superior técnica (terciaria)",
  "Educación universitaria incompleta",
  "Educación universitaria completa",
  "Postgrado (Magíster, Especialización)",
  "Doctorado",
  "Postdoctorado" // Added this new option
];

// Array of relationship types for the select input.
const relationshipTypes = [
  "Madre", "Padre", "Hija/o", "Hermano/a", "Esposo/a", "Abuela/o", 
  "Tía/o", "Primo/a", "Sobrino/a", "Suegra/o", "Nuera/o", "Otro" // Changed "Otra" to "Otro" for gender neutrality
];


// A reusable sub-component for each rating question (from 1 to 7).
const SurveyQuestion = ({ question, rating, onRatingChange }) => (
  <div className="survey-question">
    <p className="survey-question-text">{question}</p>
    <div className="rating-scale">
      {/* Map through numbers 1-7 to create a button for each rating value. */}
      {[1, 2, 3, 4, 5, 6, 7].map((value) => (
        <button
          key={value}
          type="button" // Use type="button" to prevent form submission on click.
          className={`rating-button ${rating === value ? 'selected' : ''}`} // Apply 'selected' class if this button's value matches the current rating.
          onClick={() => onRatingChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  </div>
);

// --- MAIN SURVEY COMPONENT ---
export default function SatisfactionSurvey() {
  // Get hooks for navigation and user data.
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State to hold all the form data.
  const [formData, setFormData] = useState({
    age: '',
    education: '',
    relationship: '',
    daysUsingPlatform: '',
    easeOfUse: null,
    infoRelevance: null,
    careImpact: null,
    overallSatisfaction: null,
  });

  // State to manage the UI after submission.
  const [submitted, setSubmitted] = useState(false);
  // State to display any errors to the user.
  const [error, setError] = useState('');

  // Handles changes for text inputs and select menus.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles changes for the 1-7 rating questions.
  const handleRatingChange = (question, value) => {
    setFormData((prev) => ({ ...prev, [question]: value }));
  };

  // Function to handle the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser refresh on form submission.
    const { age, education, relationship, daysUsingPlatform, ...ratings } = formData;
    
    // Basic validation to ensure all questions are answered.
    if (Object.values(ratings).some(r => r === null) || !age || !education || !relationship || !daysUsingPlatform) {
      setError('Por favor, responde todas las preguntas.');
      return;
    }

    try {
      setError(''); // Clear any previous errors.
      // Call the firestore service to save the data.
      await saveSurveyResponse({ ...formData, userId: currentUser.uid, submittedAt: new Date() });
      setSubmitted(true); // Set state to show the "Thank you" message.
    } catch (err) {
      console.error("Error submitting survey:", err);
      setError('Hubo un error al enviar la encuesta. Por favor, inténtalo de nuevo.');
    }
  };
  
  // If the form has been submitted, show a "Thank you" message.
  if (submitted) {
    return (
        <div className="auth-container">
            <div className="auth-card text-center">
                <h2>¡Gracias!</h2>
                <p>Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-4">
                    Volver al Panel
                </button>
            </div>
        </div>
    );
  }

  // Render the main survey form.
  return (
    <div className="survey-container">
      <div className="survey-card">
        {/* Button to navigate to the previous page. */}
        <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} /> Volver
        </button>
        <div className="survey-header">
            <h2>Encuesta de Satisfacción</h2>
            <p>Su opinión es fundamental para mejorar la calidad de nuestra plataforma. Agradecemos su tiempo para responder.</p>
        </div>
        <form onSubmit={handleSubmit}>
            {/* Fieldset for demographic questions. */}
            <fieldset className="survey-fieldset">
                <legend>Datos Generales</legend>
                <div className="form-group">
                    <label htmlFor="age">¿Cuántos años tiene?</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className="form-input" required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="education">¿Cuál es su nivel de escolaridad?</label>
                    <select id="education" name="education" value={formData.education} onChange={handleInputChange} className="form-input" required>
                        <option value="" disabled>Seleccione una opción</option>
                        {educationLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="relationship">¿Qué relación tiene con la persona que cuida?</label>
                    <select id="relationship" name="relationship" value={formData.relationship} onChange={handleInputChange} className="form-input" required>
                        <option value="" disabled>Seleccione una opción</option>
                        {relationshipTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="daysUsingPlatform">¿Cuántos días lleva utilizando la plataforma?</label>
                    <input type="number" id="daysUsingPlatform" name="daysUsingPlatform" value={formData.daysUsingPlatform} onChange={handleInputChange} className="form-input" required />
                </div>
            </fieldset>

            {/* Fieldset for rating questions. */}
            <fieldset className="survey-fieldset">
                <legend>Calificación (1 = Muy en desacuerdo, 7 = Muy de acuerdo)</legend>
                <SurveyQuestion question="¿Qué tan fácil le ha sido utilizar la plataforma?" rating={formData.easeOfUse} onRatingChange={(val) => handleRatingChange('easeOfUse', val)} />
                <SurveyQuestion question="¿La plataforma tiene información útil y relevante para su labor como cuidador?" rating={formData.infoRelevance} onRatingChange={(val) => handleRatingChange('infoRelevance', val)} />
                <SurveyQuestion question="¿Siente que la plataforma ha colaborado en su capacidad para cuidar a su paciente?" rating={formData.careImpact} onRatingChange={(val) => handleRatingChange('careImpact', val)} />
                <SurveyQuestion question="¿Qué nota le pondría a la plataforma en relación a la satisfacción como usuario?" rating={formData.overallSatisfaction} onRatingChange={(val) => handleRatingChange('overallSatisfaction', val)} />
            </fieldset>
            
            {/* Display an error message if there is one. */}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary w-full">Enviar Encuesta</button>
        </form>
      </div>
    </div>
  );
}
