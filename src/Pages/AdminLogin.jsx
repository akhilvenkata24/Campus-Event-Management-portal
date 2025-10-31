import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../utils/auth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const ok = await loginAdmin(email, password);
      if (ok) {
        navigate('/admin');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
        <h2>Admin Login</h2>
        <p className="muted">Use the admin credentials to access the admin portal.</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div style={{color:'crimson'}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
            <button className="btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
