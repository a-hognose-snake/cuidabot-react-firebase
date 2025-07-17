// src/services/firestoreService.js
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';

/**
 * Creates a user document in the 'users' collection upon signup.
 * @param {object} user - The user object from Firebase Auth.
 * @param {string} email - The user's email.
 */
export const createUserDocument = (user, email) => {
  return setDoc(doc(db, "users", user.uid), {
    email: email,
    role: "user" // Default role
  });
};

/**
 * Fetches a user document from Firestore.
 * @param {string} uid - The user's unique ID.
 * @returns {Promise<object|null>} The user's document data or null if it doesn't exist.
 */
export const getUserDocument = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

/**
 * Fetches all user documents for the admin panel.
 * @returns {Promise<Array>} An array of user objects with their IDs.
 */
export const getAllUsers = async () => {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Updates the role of a specific user.
 * @param {string} uid - The ID of the user to update.
 * @param {string} role - The new role ('user' or 'admin').
 */
export const updateUserRole = (uid, role) => {
  const userDocRef = doc(db, 'users', uid);
  return updateDoc(userDocRef, { role });
};

/**
 * --- NUEVA FUNCIÓN ---
 * Guarda la respuesta de la encuesta de un usuario en Firestore.
 * @param {object} surveyData - Los datos recopilados del formulario de la encuesta.
 */
export const saveSurveyResponse = (surveyData) => {
  // Añade un nuevo documento con un ID generado automáticamente 
  // a la colección 'survey_responses'.
  return addDoc(collection(db, 'survey_responses'), surveyData);
};

/**
 * --- FUNCIÓN ACTUALIZADA ---
 * Elimina el documento de un usuario Y todas sus respuestas de encuesta asociadas.
 * @param {string} uid - El ID del usuario a eliminar.
 */

export const deleteUserDocument = async (uid) => {
  // 1. Referencia a la colección de encuestas
  const surveyResponsesRef = collection(db, 'survey_responses');
    
  // 2. Crear una consulta para encontrar todas las encuestas de este usuario
  const q = query(surveyResponsesRef, where("userId", "==", uid));

  // 3. Obtener los documentos que coinciden con la consulta
  const querySnapshot = await getDocs(q);

  // 4. Iniciar una operación por lotes para eliminar múltiples documentos a la vez
  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    // Añadir cada eliminación de encuesta al lote
    batch.delete(doc.ref);
  });

  // 5. Ejecutar la eliminación de todas las encuestas
  await batch.commit();

  // 6. Finalmente, eliminar el documento del usuario
  const userDocRef = doc(db, 'users', uid);
  await deleteDoc(userDocRef);
};

/**
 * --- NEW FUNCTION ---
 * Fetches all documents from the 'survey_responses' collection.
 * @returns {Promise<Array>} An array of survey response objects with their IDs.
 */
export const getAllSurveyResponses = async () => {
  const responsesCollection = collection(db, 'survey_responses');
  const responseSnapshot = await getDocs(responsesCollection);
  // We add the document ID to each object for key and deletion purposes
  return responseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * --- NEW FUNCTION ---
 * Deletes a specific survey response document from Firestore.
 * @param {string} responseId - The ID of the survey response to delete.
 */
export const deleteSurveyResponse = (responseId) => {
  const responseDocRef = doc(db, 'survey_responses', responseId);
  return deleteDoc(responseDocRef);
};

/**
 * --- NUEVA FUNCIÓN ---
 * Obtiene la base de conocimiento del chatbot desde Firestore.
 * @returns {Promise<string>} El contenido de la base de conocimiento.
 */
export const getKnowledgeBase = async () => {
  const docRef = doc(db, "knowledge_base", "bot_info");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().content;
  } else {
    console.error("No se encontró la base de conocimiento en Firestore!");
    return "No se pudo cargar la información.";
  }
};

/**
 * --- NUEVA FUNCIÓN ---
 * Actualiza la base de conocimiento del chatbot en Firestore.
 * @param {string} newContent - El nuevo contenido para la base de conocimiento.
 */
export const updateKnowledgeBase = (newContent) => {
  const docRef = doc(db, "knowledge_base", "bot_info");
  return updateDoc(docRef, {
    content: newContent
  });
};

/**
 * --- NUEVA FUNCIÓN ---
 * Obtiene todas las preguntas y respuestas de la colección 'faqs'.
 * @returns {Promise<Array>} Un array de objetos, donde cada objeto es una pregunta.
 */
export const getFaqs = async () => {
  const faqsCollection = collection(db, 'faqs');
  const faqSnapshot = await getDocs(faqsCollection);
  return faqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * --- NUEVA FUNCIÓN ---
 * Añade una nueva pregunta frecuente a la colección 'faqs'.
 * @param {object} faqData - El objeto FAQ con pregunta, respuesta, categoría y subcategoría.
 */
export const addFaq = (faqData) => {
  return addDoc(collection(db, 'faqs'), faqData);
};

/**
 * --- NUEVA FUNCIÓN ---
 * Actualiza una pregunta frecuente existente en la colección 'faqs'.
 * @param {string} id - El ID del documento FAQ a actualizar.
 * @param {object} faqData - Los datos actualizados del FAQ.
 */
export const updateFaq = (id, faqData) => {
  const faqDocRef = doc(db, 'faqs', id);
  return updateDoc(faqDocRef, faqData);
};

/**
 * --- NUEVA FUNCIÓN ---
 * Elimina una pregunta frecuente de la colección 'faqs'.
 * @param {string} id - El ID del documento FAQ a eliminar.
 */
export const deleteFaq = (id) => {
  const faqDocRef = doc(db, 'faqs', id);
  return deleteDoc(faqDocRef);
};