import { useRef } from "react";
const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // Update chat history with the user's message
    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);
    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      // Add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [...history, { role: "model", text: "Pensando..." }]);
      // Call the function to generate the bot's response
      generateBotResponse([...chatHistory, { role: "user", text: `Actúa como un asistente digital amable y profesional del Hospital Félix Bulnes.

Reglas:
- Si la persona se despide (por ejemplo: "gracias", "chao", "adiós"), responde solamente: "Fue un gusto asistirte".
- Si la pregunta no está en la base de conocimiento, responde con: "Lo siento, no tengo información sobre eso. ¿Quieres preguntarme otra cosa?"

Recuerda ser claro, directo y respetuoso en todo momento.

Responde únicamente en español y basándote exclusivamente en la base de conocimiento proporcionada a la siguiente pregunta: ${userMessage}` }]);
    }, 600);
  };
  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input ref={inputRef} placeholder="Message..." className="message-input" required />
      <button type="submit" id="send-message" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};
export default ChatForm;