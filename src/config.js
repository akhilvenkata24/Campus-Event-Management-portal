const config = {
  // Priority: 
  // 1. REACT_APP_API_URL from environment variables (if backend is separate)
  // 2. Use /api for same-domain deployment
  // 3. Fallback to localhost for development
  API_URL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? '/api'  
             : 'http://localhost:5000')
};

export default config;