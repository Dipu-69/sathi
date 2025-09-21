const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class ChatService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyD0IZ_d0_etfZuc-bwAyH9nou2Sg9eZ3yc';
    this.geminiApiUrl = process.env.GEMINI_API_URL || 
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';
    
    if (!this.geminiApiKey) {
      console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
    } else {
      console.log('✅ Gemini API key loaded successfully');
    }
  }

  async processMessage(userMessage, session = {}) {
    try {
      // Check FAQ first, but only use it for very high confidence matches
      const faqResult = await this.checkFAQ(userMessage);
      
      // Call Gemini API for AI response
      const aiResponse = await this.callGeminiAPI(userMessage, session);
      
      // Only use FAQ if it has very high confidence (>0.95) and AI confidence is low
      if (faqResult && faqResult.confidence > 0.95 && aiResponse.confidence < 0.7) {
        return {
          reply: faqResult.answer,
          confidence: faqResult.confidence,
          source: 'faq',
          escalationOffered: false
        };
      }

      // Check if escalation should be offered
      const shouldEscalate = this.shouldOfferEscalation(aiResponse, faqResult);
      
      if (shouldEscalate) {
        return {
          reply: aiResponse.reply + '\n\nI\'m not entirely sure about that. Would you like me to connect you to a human support agent who can help you better?',
          confidence: aiResponse.confidence,
          source: 'ai_with_escalation',
          escalationOffered: true
        };
      }

      return {
        reply: aiResponse.reply,
        confidence: aiResponse.confidence,
        source: 'ai',
        escalationOffered: false
      };

    } catch (error) {
      console.error('Error processing message:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      
      return {
        reply: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment, or contact our support team directly.',
        confidence: 0,
        source: 'error',
        escalationOffered: true
      };
    }
  }

  async checkFAQ(userMessage) {
    const faqData = [
      {
        question: "How do I create an account?",
        answer: "To create an account, click the 'Sign Up' button on our homepage. You'll need to provide your email address and create a secure password. We'll send you a verification email to confirm your account.",
        keywords: ["account", "create", "signup", "register", "sign up"],
        confidence: 0.9
      },
      {
        question: "How do I find a consultant?",
        answer: "You can find consultants by going to the 'Consultants' page. Use the search and filter options to find someone who specializes in your area of need. You can filter by specialty, availability, and other preferences.",
        keywords: ["consultant", "find", "search", "therapist", "counselor"],
        confidence: 0.9
      },
      {
        question: "Is my data secure and private?",
        answer: "Yes, absolutely. We take your privacy and data security very seriously. All conversations are encrypted and stored securely. We never share your personal information without your explicit consent.",
        keywords: ["privacy", "security", "data", "secure", "private", "confidential"],
        confidence: 0.9
      },
      {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address, and we'll send you a secure link to reset your password.",
        keywords: ["password", "reset", "forgot", "login", "access"],
        confidence: 0.9
      },
      {
        question: "What if I'm in crisis?",
        answer: "If you're experiencing a mental health crisis, please contact emergency services immediately (911) or a crisis hotline. Our platform is for general support and guidance, not emergency situations.",
        keywords: ["crisis", "emergency", "urgent", "help", "suicide", "self-harm"],
        confidence: 0.95
      },
      {
        question: "How much does it cost?",
        answer: "Our basic platform features are free to use. Premium features and direct consultant sessions may have associated costs. You can view our pricing on the 'Pricing' page or contact support for specific details.",
        keywords: ["cost", "price", "pricing", "free", "payment", "billing"],
        confidence: 0.8
      },
      {
        question: "I'm having technical problems with the website",
        answer: "I'm sorry you're experiencing technical issues! Here are some common solutions: 1) Try refreshing the page (Ctrl+F5), 2) Clear your browser cache, 3) Check your internet connection, 4) Try a different browser, 5) Disable browser extensions temporarily. If the problem persists, please describe the specific error message you're seeing.",
        keywords: ["technical", "problem", "issue", "website", "loading", "error", "not working", "broken", "bug"],
        confidence: 0.9
      },
      {
        question: "The website is not loading properly",
        answer: "If the website isn't loading properly, try these steps: 1) Check your internet connection, 2) Refresh the page (Ctrl+F5), 3) Clear your browser cache and cookies, 4) Try incognito/private browsing mode, 5) Disable ad blockers temporarily. If you're still having issues, please let me know what specific error you're seeing.",
        keywords: ["loading", "website", "not working", "slow", "error", "page", "browser"],
        confidence: 0.9
      },
      {
        question: "I'm getting error messages",
        answer: "I'm here to help with those error messages! Please share the specific error message you're seeing, and I'll guide you through troubleshooting. Common errors include: 'Failed to fetch' (connection issues), 'Page not found' (broken links), or 'Server error' (temporary issues). The more details you can provide, the better I can assist you.",
        keywords: ["error", "message", "failed", "fetch", "server", "not found", "broken"],
        confidence: 0.9
      },
      {
        question: "How is my data protected and who can see my conversations?",
        answer: "Your privacy and data security are our top priorities! Here's how we protect you: 1) All conversations are encrypted end-to-end, 2) Only you and our AI can see your chat history, 3) We never share your personal information with third parties, 4) Your data is stored on secure, encrypted servers, 5) You can delete your chat history anytime. We follow strict privacy regulations and never use your conversations for marketing.",
        keywords: ["privacy", "data", "security", "protected", "conversations", "encrypted", "private", "confidential", "who can see"],
        confidence: 0.95
      },
      {
        question: "Is my information secure on this platform?",
        answer: "Yes, absolutely! We use industry-standard security measures: 1) End-to-end encryption for all communications, 2) Secure HTTPS connections, 3) Regular security audits, 4) No data sharing with third parties, 5) You control your data - you can delete it anytime. We're committed to keeping your mental health journey private and secure. Your trust is important to us.",
        keywords: ["secure", "information", "security", "safe", "encrypted", "protected", "data"],
        confidence: 0.95
      }
    ];

    const normalizedMessage = userMessage.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of faqData) {
      const score = this.calculateMatchScore(normalizedMessage, faq);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { ...faq, confidence: score };
      }
    }

    return bestScore > 0.8 ? bestMatch : null;
  }

  calculateMatchScore(userMessage, faq) {
    let score = 0;
    const messageWords = userMessage.split(/\s+/);
    
    // Check exact question match
    if (userMessage.includes(faq.question.toLowerCase())) {
      score += 1.0;
    }
    
    // Check keyword matches
    for (const keyword of faq.keywords) {
      if (userMessage.includes(keyword.toLowerCase())) {
        score += 0.2;
      }
    }
    
    // Check for partial word matches
    for (const word of messageWords) {
      for (const keyword of faq.keywords) {
        if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
          score += 0.1;
        }
      }
    }
    
    return Math.min(1.0, score);
  }

  async callGeminiAPI(userMessage, session) {
    if (!this.geminiApiKey || this.geminiApiKey === 'your_gemini_api_key_here') {
      return {
        reply: `I understand you're asking: "${userMessage}". I'm currently in demo mode. To get AI-powered responses, please configure your Gemini API key. For now, I can help with our FAQ questions!`,
        confidence: 0.5
      };
    }

    const systemPrompt = `You are Sathi's customer support AI assistant. Sathi is a mental health support platform that provides:

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

IMPORTANT: Provide SPECIFIC and DIFFERENT responses based on the user's query type. NEVER give the same response twice - always vary your approach:

For TECHNICAL ISSUES:
- Ask specific questions about what's happening
- Provide different troubleshooting approaches each time
- Focus on the user's specific situation
- Offer personalized solutions based on their description
- Vary your response style and approach

For PRIVACY QUESTIONS:
- Explain data encryption and security measures
- Clarify who can see their information
- Mention data control options
- Reassure about privacy protection

For ACCOUNT HELP:
- Guide through specific account processes
- Provide clear instructions for login/password issues
- Explain profile settings

For FINDING CONSULTANTS:
- Explain the consultant search process
- Mention filtering options
- Guide to the consultants page

Remember: Always provide fresh, contextual responses. Never repeat the same troubleshooting steps. Ask follow-up questions to understand their specific situation better.

Respond in a helpful, caring manner that reflects Sathi's mission of gentle mental health support.`;

    // Build conversation context
    const conversationContext = session.messages ? 
      session.messages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n') : '';
    
    const userPrompt = conversationContext ? 
      `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nCurrent user message: ${userMessage}` :
      `${systemPrompt}\n\nUser: ${userMessage}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.9, // Increased for more varied responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const candidate = data.candidates[0];
    const reply = candidate.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t generate a response.';
    
    const confidence = this.calculateConfidence(candidate);

    return {
      reply: reply.trim(),
      confidence
    };
  }

  calculateConfidence(candidate) {
    let confidence = 0.8;
    
    if (candidate.safetyRatings) {
      const hasBlockedContent = candidate.safetyRatings.some(
        rating => rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
      );
      if (hasBlockedContent) {
        confidence -= 0.3;
      }
    }

    const responseText = candidate.content?.parts?.[0]?.text || '';
    if (responseText.length < 20) {
      confidence -= 0.2;
    }

    const uncertaintyWords = ['might', 'maybe', 'possibly', 'not sure', 'unclear', 'uncertain'];
    const hasUncertainty = uncertaintyWords.some(word => 
      responseText.toLowerCase().includes(word)
    );
    if (hasUncertainty) {
      confidence -= 0.1;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  shouldOfferEscalation(aiResponse, faqResult) {
    if (aiResponse.confidence < 0.6) return true;
    if (!faqResult || faqResult.confidence < 0.5) return true;
    
    const uncertaintyPhrases = [
      'i don\'t know',
      'i\'m not sure',
      'i can\'t help',
      'i\'m unable to',
      'i don\'t have information',
      'i\'m not certain'
    ];
    
    const hasUncertainty = uncertaintyPhrases.some(phrase =>
      aiResponse.reply.toLowerCase().includes(phrase)
    );
    
    return hasUncertainty;
  }
}

module.exports = ChatService;





