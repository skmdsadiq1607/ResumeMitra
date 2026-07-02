/**
 * AI Resume Grader - Main Server Entry Point
 * Initializes Express app, connects to MongoDB, and starts HTTP server
 */

require('dotenv').config();

// Fix DNS SRV resolution on networks where the local DNS server
// doesn't support SRV records (needed for mongodb+srv:// URIs)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', ...dns.getServers()]);

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 API available at: http://localhost:${PORT}/api`);

      // ── Startup diagnostic: reveal which AI provider is active ──
      const k = process.env.GEMINI_API_KEY || '';
      const provider = k.startsWith('gsk_') ? 'Groq'
        : k.startsWith('sk-or-v1-') ? 'OpenRouter'
        : k.startsWith('AIza') ? 'Google Gemini (direct)'
        : k ? 'Unknown provider'
        : 'NOT CONFIGURED';
      const masked = k ? `${k.substring(0, 8)}...${k.slice(-4)}` : 'none';
      console.log(`🔑 AI Provider: ${provider} | Key: ${masked}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

startServer();
