import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Gemini API configuration
const GEMINI_CONFIG = {
  API_URL: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  API_KEY: process.env.GEMINI_API_KEY,
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  SYSTEM_PROMPT: `You are Sathi's customer support AI assistant. Sathi is a mental health support platform that provides:

1. AI-powered chat support for mental wellness
2. Access to trusted mental health consultants  
3. Resources and tools for stress management
4. A safe, private space for users to seek help

Key information about Sathi:
- We prioritize user privacy and data security
- Our platform offers gentle, supportive AI guidance
- Users can connect with professional consultants
- We provide 24/7 support through this chat
- Our approach is calm, empathetic, and non-judgmental

Guidelines for responses:
- Be warm, empathetic, and supportive
- Keep responses concise but helpful (under 150 words)
- If users need professional help, guide them to our consultants
- For technical issues, provide clear troubleshooting steps
- Always maintain a calm, reassuring tone
- If you can't help with something, offer to connect them with human support
- Remember this is a mental health platform, so be extra sensitive
- Use simple, accessible language
- Avoid medical advice - refer to professionals when needed

Common support topics:
- Account issues (login, password reset, profile settings)
- Technical problems (app not loading, features not working)
- Privacy and data questions
- Billing and subscription support
- How to find and connect with consultants
- Using chat features and resources
- General platform guidance

Respond in a helpful, caring manner that reflects Sathi's mission of gentle mental health support.`
};

// Validation middleware
const validateChatMessage = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('conversationId')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) {
        return true; // Allow null/undefined
      }
      if (typeof value === 'string' && value.length <= 100) {
        return true; // Allow valid strings
      }
      throw new Error('Conversation ID must be a string or null');
    })
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoints for BackendConnector and BackendTest components
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend test endpoint working',
    timestamp: new Date().toISOString(),
    port: PORT,
    endpoint: 'GET /api/test'
  });
});

app.post('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend POST test endpoint working',
    receivedData: req.body,
    timestamp: new Date().toISOString(),
    port: PORT,
    endpoint: 'POST /api/test'
  });
});

// Chat endpoint
app.post('/api/chat', validateChatMessage, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array()
      });
    }

    const { message, conversationId } = req.body;

    // Check if Gemini API key is configured
    if (!GEMINI_CONFIG.API_KEY) {
      return res.status(500).json({
        error: 'AI service not configured',
        message: 'The AI service is temporarily unavailable. Please try again later or contact support.'
      });
    }

    // Call Gemini API
    const response = await fetch(`${GEMINI_CONFIG.API_URL}?key=${GEMINI_CONFIG.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${GEMINI_CONFIG.SYSTEM_PROMPT}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: GEMINI_CONFIG.GENERATION_CONFIG
      })
    });

    if (!response.ok) {
      console.error('Gemini API Error:', response.status, response.statusText);
      
      let errorMessage = 'I\'m experiencing some technical difficulties right now. Please try again in a moment.';
      
      if (response.status === 400) {
        errorMessage = 'There was an issue processing your request. Please try rephrasing your message.';
      } else if (response.status === 403) {
        errorMessage = 'The AI service is temporarily unavailable due to quota limits. Please try again later.';
      } else if (response.status === 429) {
        errorMessage = 'I\'m receiving too many requests right now. Please wait a moment and try again.';
      }

      return res.status(200).json({
        response: errorMessage,
        conversationId: conversationId || generateConversationId(),
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 
      'I\'m sorry, I couldn\'t generate a response. Please try again or contact our support team.';

    // Return successful response
    res.json({
      response: aiResponse,
      conversationId: conversationId || generateConversationId(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'I\'m experiencing some technical difficulties. Please try again later or contact our support team.',
      timestamp: new Date().toISOString()
    });
  }
});

// Get chat configuration
app.get('/api/chat/config', (req, res) => {
  res.json({
    maxMessageLength: 500,
    supportedFeatures: ['text', 'quickActions'],
    quickActions: [
      { label: 'Account Help', message: 'I need help with my account' },
      { label: 'Technical Issue', message: 'I\'m experiencing a technical problem' },
      { label: 'Privacy Questions', message: 'I have questions about privacy and data' },
      { label: 'Find Consultants', message: 'How do I find and connect with consultants?' },
      { label: 'Billing Support', message: 'I need help with billing or payments' },
      { label: 'Chat Features', message: 'How do I use the chat features?' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist.'
  });
});

// Utility function to generate conversation IDs
function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sathi Chatbot Backend running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!GEMINI_CONFIG.API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not configured. Chat functionality will be limited.');
  } else {
    console.log('✅ Gemini API configured successfully');
  }
});

export default app;