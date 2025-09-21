const ChatService = require('./services/chatService');

async function debugChat() {
  console.log('Testing ChatService...');
  
  const chatService = new ChatService();
  
  try {
    console.log('Testing with simple message...');
    const result = await chatService.processMessage('hey!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error in debug:', error);
  }
}

debugChat();
