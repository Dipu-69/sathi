import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./message-bubble";
import InputBar from "./input-bar";
import Suggestions from "./suggestions";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hi, I'm Sathi. What's on your mind today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Call backend API for chat
  const callChatAPI = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update conversation ID if provided
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      return data.response || "I'm sorry, I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('Chat API Error:', error);
      return "I'm having trouble connecting right now. Please check your internet connection and try again.";
    }
  };

  const onSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);

    try {
      // Get AI response from backend
      const aiResponse = await callChatAPI(text);
      
      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse
      };
      
      setMessages((m) => [...m, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again in a moment."
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSuggestion = (text) => onSend(text);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div
        ref={listRef}
        className="h-[60vh] overflow-y-auto p-4 scroll-smooth"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-3 space-y-3">
        <Suggestions onPick={onSuggestion} />
        <InputBar onSend={onSend} disabled={isLoading} />
      </div>
    </div>
  );
}