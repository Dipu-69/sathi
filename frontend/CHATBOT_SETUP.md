# Sathi Support Chatbot Setup

## Overview
The Sathi Support Chatbot is an AI-powered customer support assistant with a secure backend architecture. It uses Google's Gemini Pro 2.5 API to provide intelligent, empathetic responses that align with Sathi's mission of gentle mental health support.

## Architecture

### Backend (Node.js/Express)
- **Secure API Key Handling**: API keys stored server-side, never exposed to client
- **Rate Limiting**: Prevents abuse with configurable request limits
- **Error Handling**: Graceful fallbacks and proper error responses
- **CORS Protection**: Configured for your frontend domain
- **Health Monitoring**: Built-in health check endpoints

### Frontend (React)
- **Design Integration**: Matches Sathi's design system perfectly
- **Real-time Status**: Shows connection status and backend availability
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Recovery**: Automatic reconnection and fallback messages

## Features

### AI Capabilities
- **Gemini Pro 2.5**: Latest Google AI model for natural conversations
- **Context-Aware**: Understands Sathi's platform and services
- **Empathetic Responses**: Trained to be supportive and mental health-sensitive
- **Quick Actions**: Pre-defined buttons for common support topics

### Security Features
- **Server-side API Keys**: No sensitive data exposed to client
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Sanitized and validated user inputs
- **CORS Protection**: Restricted to your domain only

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd Sathi/server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### 3. Frontend Setup
1. Navigate back to the main directory:
   ```bash
   cd ..
   ```

2. The frontend dependencies should already be installed. If not:
   ```bash
   npm install
   ```

### 4. Start the Application

#### Option A: Start Both Services Together (Recommended)
```bash
npm run dev:full
```

#### Option B: Start Services Separately
Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

### 5. Test the Chatbot
1. Open your browser to `http://localhost:5173`
2. Click the chat icon in the bottom-right corner
3. Try these sample conversations:
   - "I need help with my account"
   - "How do I find a consultant?"
   - "I'm having technical issues"
   - "What's your privacy policy?"

## File Structure

```
Sathi/src/components/support/
├── support-chatbot.jsx          # Main chatbot component
└── 

Sathi/src/lib/
├── gemini-config.js             # API configuration and prompts
└── utils.js                     # Utility functions (existing)
```

## Customization

### Modify AI Behavior
Edit `src/lib/gemini-config.js`:
- **SYSTEM_PROMPT**: Adjust the AI's personality and knowledge
- **QUICK_ACTIONS**: Change the quick action buttons
- **GENERATION_CONFIG**: Tune AI response parameters

### Styling Changes
The chatbot uses Tailwind CSS classes that inherit from your design system:
- **Colors**: Uses `primary`, `accent`, `muted` from your theme
- **Spacing**: Follows your container and padding patterns
- **Typography**: Uses your font stack (Inter/Manrope)

### Position and Size
In `support-chatbot.jsx`, modify:
- **Position**: Change `bottom-6 right-6` classes
- **Size**: Adjust `w-96 h-[500px]` for chat window dimensions
- **Mobile**: Responsive breakpoints in the component

## API Usage and Costs

### Gemini API Pricing
- **Free Tier**: 15 requests per minute, 1,500 requests per day
- **Paid Tier**: $0.00025 per 1K characters (input) + $0.00075 per 1K characters (output)

### Optimization Tips
- **Response Length**: Limited to ~150 words to control costs
- **Caching**: Consider implementing response caching for common questions
- **Rate Limiting**: Built-in handling for API rate limits

## Security Considerations

### API Key Storage
- **Development**: Stored in localStorage (current implementation)
- **Production**: Consider using environment variables or secure key management
- **User Keys**: Each user manages their own API key (current approach)

### Data Privacy
- **No Storage**: Conversations are not stored server-side
- **Local Only**: Messages exist only in browser session
- **HIPAA Compliance**: No PHI is sent to external APIs

## Troubleshooting

### Common Issues

1. **"API key doesn't have permission"**
   - Ensure the API key is valid and active
   - Check Google Cloud Console for API quotas

2. **"Rate limit exceeded"**
   - Wait a few minutes before trying again
   - Consider upgrading to paid tier for higher limits

3. **Chatbot not appearing**
   - Check browser console for JavaScript errors
   - Ensure all dependencies are installed (`npm install`)

4. **Styling issues**
   - Verify Tailwind CSS is properly configured
   - Check that all UI components are imported correctly

### Debug Mode
Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('sathi_debug', 'true');
```

## Future Enhancements

### Planned Features
- **Conversation History**: Persistent chat history across sessions
- **Human Handoff**: Seamless transfer to human agents
- **Multilingual Support**: Support for multiple languages
- **Voice Input**: Speech-to-text integration
- **Analytics**: Usage tracking and conversation insights

### Integration Ideas
- **CRM Integration**: Connect with customer support systems
- **Knowledge Base**: Link to help articles and resources
- **Appointment Booking**: Direct integration with consultant scheduling
- **Crisis Detection**: Automatic escalation for mental health emergencies

## Support

For technical issues with the chatbot implementation:
1. Check the browser console for error messages
2. Verify API key configuration
3. Test with simple messages first
4. Review the Gemini API documentation

The chatbot is designed to be a supportive first point of contact while maintaining Sathi's caring, empathetic approach to mental health support.