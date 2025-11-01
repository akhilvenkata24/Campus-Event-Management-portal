import config from '../config';
const KEY = 'campus_admin_authenticated';
const TOKEN_KEY = 'campus_admin_token';
// Use central API base URL


// Function to securely store token with expiration
const securelyStoreToken = (token) => {
  try {
    const tokenData = {
      value: token,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    localStorage.setItem(KEY, '1');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export async function loginAdmin(email, password) {
  try {
    const res = await fetch(`${config.API_URL}/admin/login`, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, 
      body: JSON.stringify({ email, password }) 
    });

    const data = await res.json();
    console.log('Login response:', { status: res.status, data }); // For debugging

    if (!res.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    const { token } = data;
    if (token) {
      securelyStoreToken(token);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Login error:', err);
    throw new Error(err.message || 'Login failed. Please try again.');
  }
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function isAdminAuthenticated() {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return false;
    
    const { expires } = JSON.parse(tokenData);
    if (Date.now() > expires) {
      logoutAdmin();
      return false;
    }
    
    return localStorage.getItem(KEY) === '1';
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export function getAdminToken() {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return '';
    
    const { value, expires } = JSON.parse(tokenData);
    if (Date.now() > expires) {
      logoutAdmin();
      return '';
    }
    
    return value;
  } catch (error) {
    console.error('Token retrieval error:', error);
    return '';
  }
}

const auth = { loginAdmin, logoutAdmin, isAdminAuthenticated };

export default auth;
