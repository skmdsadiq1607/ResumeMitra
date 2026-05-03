require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('--- Testing Gemini 1.5 Flash ---');
    const result = await model.generateContent('Say "Ready"');
    console.log('Result:', result.response.text());
    
  } catch (error) {
    console.error('❌ Error details:', error);
    if (error.message.includes('404')) {
      console.log('\n💡 Tip: Your API key might not have access to 1.5 Flash yet, or it is restricted to specific models.');
    }
  }
}

listModels();
