import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminToken } from '../utils/auth';
import config from '../config';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    image: "",
    status: "upcoming"
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${config.API_URL}/events/${id}`, {
          headers: { 'x-auth-token': getAdminToken() }
        });
        if (!res.ok) throw new Error('Failed to fetch event');
        const event = await res.json();
        
        // Format date for input field
        const date = new Date(event.date);
        const formattedDate = date.toISOString().split('T')[0];
        
        setFormData({
          title: event.title || '',
          date: formattedDate || '',
          time: event.time || '',
          location: event.location || '',
          description: event.description || '',
          category: event.category || '',
          image: event.image || '',
          status: event.status || 'upcoming'
        });
      } catch (err) {
        console.error('Failed to fetch event:', err);
        alert('Could not load event');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5000000) { // 5MB limit
          alert('File is too large. Please choose an image under 5MB.');
          e.target.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, [name]: reader.result }));
        };
        reader.onerror = () => {
          alert('Error reading file');
          e.target.value = '';
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update status based on date
      const isUpcoming = new Date(formData.date) > new Date();
      
      // Only include the image in the update if it has changed
      const updatedFormData = {
        ...formData,
        status: isUpcoming ? 'upcoming' : 'completed',
        image: formData.image // Only send if changed
      };

      const res = await fetch(`${config.API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': getAdminToken()
        },
        body: JSON.stringify(updatedFormData)
      });
      
      if (!res.ok) throw new Error('Failed to update event');
      
      alert('Event updated successfully');
      navigate('/admin');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{maxWidth: 820, margin: '24px auto'}}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth: 820, margin: '24px auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <h2>Edit Event</h2>
          <button className="btn" onClick={() => navigate('/admin')}>Cancel</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Event Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required />

          <div className="form-row">
            <div>
              <label>Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div>
              <label>Time</label>
              <input name="time" type="time" value={formData.time} onChange={handleChange} />
            </div>
          </div>

          <label>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />

          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="workshop">Workshop</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="career">Career</option>
          </select>

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>

          <label>Event Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ marginBottom: '16px' }}
          />
          {formData.image && (
            <div style={{ marginBottom: '16px' }}>
              <img 
                src={formData.image} 
                alt="Event preview" 
                style={{ maxWidth: '200px', borderRadius: '8px' }} 
              />
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 16}}>
            <button type="button" className="btn" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="btn-primary">Update Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;