const config = {
  API_URL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? '/api'  // For Vercel deployment, API routes will be on same domain
             : 'http://localhost:5000')
};

export default config;