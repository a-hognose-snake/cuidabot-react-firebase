import React, { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
//import { botInfo } from "../../data/botInfo";
import { getKnowledgeBase } from "../../services/firestoreService"; 


export default function Chatbot({ currentUser }) {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  /*
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: botInfo,
    },
  ]);
  */
  const [chatHistory, setChatHistory] = useState([]);
  const [isKbLoading, setIsKbLoading] = useState(true);

  // useEffect para cargar la base de conocimiento al montar el componente
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      const kbContent = await getKnowledgeBase();
      setChatHistory([{
        hideInChat: true,
        role: "model",
        text: kbContent,
      }]);
      setIsKbLoading(false);
    };
    loadKnowledgeBase();
  }, []);


  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Pensando..."), { role: "model", text, isError }]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // IMPORTANT: Make sure VITE_API_URL is set in your .env file
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Hubo un error.");
      
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    if (showChatbot && chatBodyRef.current) {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory, showChatbot]);

  // No mostramos el chatbot hasta que la base de conocimiento se haya cargado
  if (isKbLoading) {
    return null;
  }

  return (
    <div className={`chatbot-container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Asistente Virtual</h2>
          </div>
          <button onClick={() => setShowChatbot(false)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              ¡Hola, {currentUser?.email || 'invitado'}!<br/>
              Soy tu asistente digital del Hospital Félix Bulnes.
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
}
