const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const ChatService = require('./services/chatService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
  credentials: true
}));

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks in development
    return process.env.NODE_ENV === 'development' && req.path === '/api/health';
  }
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connect (optional for chatbot functionality)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sathi")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.warn("⚠️ MongoDB connection failed, but chatbot will still work:", err.message);
  });

// Initialize services
const chatService = new ChatService();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Sathi AI Support'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    // Process the message
    const response = await chatService.processMessage(message, { conversationId });

    res.json({
      response: response.reply,
      conversationId: conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      confidence: response.confidence,
      source: response.source,
      escalationOffered: response.escalationOffered
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
    });
  }
});

// Chat configuration endpoint
app.get('/api/chat/config', (req, res) => {
  res.json({
    quickActions: [
      { label: 'Account Help', message: 'I need help with my account' },
      { label: 'Technical Issue', message: 'I\'m experiencing a technical problem' },
      { label: 'Privacy Questions', message: 'I have questions about privacy and data' },
      { label: 'Find Consultants', message: 'How do I find and connect with consultants?' },
      { label: 'Billing Support', message: 'I need help with billing or payments' },
      { label: 'Chat Features', message: 'How do I use the chat features?' }
    ],
    features: {
      aiPowered: true,
      escalationAvailable: true,
      faqEnabled: true
    }
  });
});

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: "Sathi Backend is working!" });
});

// Root route
app.get('/', (req, res) => {
  res.send('Sathi Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    response: 'I apologize, but something went wrong. Please try again later.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sathi Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔧 Chat config: http://localhost:${PORT}/api/chat/config`);
});
// Root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});