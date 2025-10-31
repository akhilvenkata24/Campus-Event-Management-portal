import { useState } from "react";
import { getAdminToken } from '../utils/auth';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    image: "",
  });

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
      // Check if the event date is in the future
      const isUpcoming = new Date(formData.date) > new Date();
      
      const payload = { 
        title: formData.title, 
        description: formData.description, 
        date: formData.date, 
        time: formData.time,
        location: formData.location, 
        category: formData.category,
        status: isUpcoming ? 'upcoming' : 'completed',
        image: formData.image // Don't set default image here
      };
      // send to backend (proxy handles /api)
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': getAdminToken() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create event');
      const data = await res.json();
      alert('Event created successfully');
      console.log('Created', data);
      setFormData({ title: '', date: '', time: '', location: '', description: '', category: '' });
    } catch (err) {
      console.error(err);
      alert('Error creating event — check console');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:820, margin:'24px auto'}}>
        <h2>Create New Event</h2>
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
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="workshop">Workshop</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="career">Career</option>
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

          <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
            <button className="btn-primary" type="submit">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
