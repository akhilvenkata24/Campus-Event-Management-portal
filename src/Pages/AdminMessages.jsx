import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminToken } from '../utils/auth';
import './AdminMessages.css';
import config from '../config';

const AdminMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const token = getAdminToken();
      if (!token) {
        setError('Please login as admin first');
        navigate('/admin/login');
        return;
      }
      
      const res = await fetch(`${config.API_URL}/contact`, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id) => {
    try {
      const token = getAdminToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const res = await fetch(`${config.API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to update message');

      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      console.error('Mark as read error:', err);
      alert(err.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const token = getAdminToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const res = await fetch(`${config.API_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message);
    }
  };

  if (loading) return <div className="messages-loading">Loading messages...</div>;
  if (error) return <div className="messages-error">{error}</div>;

  return (
    <div className="admin-messages">
      <h2>Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg._id} className={`message-card ${msg.isRead ? 'read' : 'unread'}`}>
              <div className="message-header">
                <h3>{msg.subject}</h3>
                <span className="message-date">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="message-sender">
                From: {msg.name} ({msg.email})
              </div>
              <div className="message-content">{msg.message}</div>
              <div className="message-actions">
                {!msg.isRead && (
                  <button onClick={() => markAsRead(msg._id)}>
                    Mark as Read
                  </button>
                )}
                <button onClick={() => deleteMessage(msg._id)} className="delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;