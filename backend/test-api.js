// Test Sathi Backend API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
    try {
        console.log('Testing Sathi Backend API...');
        
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        console.log('Health check:', healthData);
        
        // Test chat endpoint
        const chatResponse = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Hello, I need help with my account'
            })
        });
        
        const chatData = await chatResponse.json();
        console.log('Chat response:', JSON.stringify(chatData, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();





