import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

// API Configuration - UPDATED TO USE PORT 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Sathi's support assistant. I'm here to help you with any questions about our platform, from account issues to finding the right consultant. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [debugInfo, setDebugInfo] = useState(''); // Added for debugging
  const [lastHealthCheck, setLastHealthCheck] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check backend health and load config on component mount
  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL); // Debug log
    checkBackendHealth();
    loadChatConfig();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Check if backend is available (with throttling)
  const checkBackendHealth = async () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastHealthCheck;
    
    // Throttle health checks to max once every 5 seconds
    if (timeSinceLastCheck < 5000) {
      console.log('Health check throttled, skipping...');
      return;
    }
    
    setLastHealthCheck(now);
    
    try {
      console.log('Checking backend health at:', `${API_BASE_URL}/health`);
      setDebugInfo(`Checking: ${API_BASE_URL}/health`);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });
      
      console.log('Health check response status:', response.status);
      console.log('Health check response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check data:', data);
        setIsBackendAvailable(true);
        setConnectionStatus('connected');
        setDebugInfo(`Connected! Status: ${data.status}`);
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendAvailable(false);
      setConnectionStatus('disconnected');
      setDebugInfo(`Error: ${error.message}`);
    }
  };

  // Load chat configuration from backend (with throttling)
  const loadChatConfig = async () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastHealthCheck;
    
    // Throttle config loading to max once every 10 seconds
    if (timeSinceLastCheck < 10000) {
      console.log('Config loading throttled, using fallback...');
      setQuickActions([
        { label: 'Account Help', message: 'I need help with my account - login issues, password reset, or profile settings' },
        { label: 'Technical Issue', message: 'I\'m having technical problems - the website is not loading properly, features are not working, or I\'m getting error messages' },
        { label: 'Privacy Questions', message: 'I have questions about my data privacy and security - how is my information protected and who can see my conversations?' },
        { label: 'Find Consultants', message: 'How do I find and connect with mental health consultants on your platform?' }
      ]);
      return;
    }
    
    try {
      console.log('Loading chat config from:', `${API_BASE_URL}/chat/config`);
      
      const response = await fetch(`${API_BASE_URL}/chat/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const config = await response.json();
        console.log('Chat config loaded:', config);
        setQuickActions(config.quickActions || []);
      }
    } catch (error) {
      console.error('Failed to load chat config:', error);
      // Fallback quick actions
      setQuickActions([
        { label: 'Account Help', message: 'I need help with my account - login issues, password reset, or profile settings' },
        { label: 'Technical Issue', message: 'I\'m having technical problems - the website is not loading properly, features are not working, or I\'m getting error messages' },
        { label: 'Privacy Questions', message: 'I have questions about my data privacy and security - how is my information protected and who can see my conversations?' },
        { label: 'Find Consultants', message: 'How do I find and connect with mental health consultants on your platform?' }
      ]);
    }
  };

  // Call backend API for chat
  const callChatAPI = async (userMessage) => {
    if (!isBackendAvailable) {
      return "I'm currently unable to connect to our support system. Please try refreshing the page or contact our support team directly.";
    }

    try {
      setConnectionStatus('connecting');
      console.log('Sending chat message to:', `${API_BASE_URL}/chat`);
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId,
          session: {
            messages: conversationHistory.slice(-10) // Send last 10 messages for context
          }
        })
      });

      console.log('Chat API response status:', response.status);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('rate_limit');
        } else if (response.status >= 500) {
          throw new Error('server_error');
        } else {
          throw new Error('api_error');
        }
      }

      const data = await response.json();
      console.log('Chat API response data:', data);
      
      // Update conversation ID if provided
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      
      setConnectionStatus('connected');
      return data.response || "I'm sorry, I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('Chat API Error:', error);
      setConnectionStatus('error');
      
      if (error.message === 'rate_limit') {
        return "I'm receiving too many requests right now. Please wait a moment and try again.";
      } else if (error.message === 'server_error') {
        return "I'm experiencing some technical difficulties. Please try again in a moment, or contact our support team.";
      } else {
        return "I'm having trouble connecting right now. Please check your internet connection and try again.";
      }
    }
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Update conversation history
    setConversationHistory(prev => [...prev, 
      { role: 'user', content: messageText },
      { role: 'assistant', content: '' } // Will be updated with AI response
    ]);

    // Get AI response from backend
    const aiResponse = await callChatAPI(messageText);
    
    const botMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    
    // Update conversation history with AI response
    setConversationHistory(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { role: 'assistant', content: aiResponse };
      }
      return updated;
    });
    
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case 'connecting':
        return <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />;
      case 'disconnected':
      case 'error':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      default:
        return <Wifi className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'AI-powered';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Offline';
      case 'error':
        return 'Connection error';
      default:
        return 'Ready';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "border-2 border-primary/20 hover:border-primary/40",
            isOpen && "rotate-180"
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-fade-in">
          <Card className="flex flex-col h-[500px] shadow-xl border-border/50 bg-card backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Sathi Support</h3>
                  <div className="flex items-center gap-1">
                    {getConnectionIcon()}
                    <p className="text-xs opacity-90">{getStatusText()}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Debug Info */}
            <div className="p-2 bg-yellow-50 border-b text-xs text-gray-600">
              <strong>Debug:</strong> {debugInfo || 'Initializing...'}
            </div>

            {/* Connection Warning */}
            {!isBackendAvailable && (
              <div className="p-3 bg-destructive/10 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Support system offline. Limited functionality available.</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[85%] message-slide-in",
                    message.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.sender === 'bot'
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}>
                    {message.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className={cn(
                      "px-4 py-2 rounded-lg text-sm",
                      message.sender === 'bot'
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}>
                      {message.text}
                    </div>
                    <div className={cn(
                      "text-xs text-muted-foreground px-1",
                      message.sender === 'user' && "text-right"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted px-4 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - Always visible */}
            {quickActions.length > 0 && (
              <div className="px-4 pb-2 border-t border-border/50 bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2 px-1 mt-2 font-medium">Quick help topics:</div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 justify-start hover:bg-primary/10 transition-colors"
                      onClick={() => handleSendMessage(action.message)}
                      disabled={isLoading || !isBackendAvailable}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoading || !isBackendAvailable}
                  maxLength={500}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading || !isBackendAvailable}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!isBackendAvailable && (
                <p className="text-xs text-muted-foreground mt-2 px-1">
                  ⚠️ Support system is currently offline. Please try again later.
                </p>
              )}
              {/* Debug button */}
              <Button
                onClick={checkBackendHealth}
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
              >
                Test Connection
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}