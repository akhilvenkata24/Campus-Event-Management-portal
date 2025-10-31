import { useState, useEffect } from "react";
import "./EventRegister.css";

const EventRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    regNo: "",
    mobile: "",
    eventId: ""
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        const availableEvents = data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate > new Date();
        });
        setEvents(availableEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        alert('Failed to load available events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!formData.regNo.trim()) {
      newErrors.regNo = 'Registration number is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.eventId) {
      newErrors.eventId = 'Please select an event';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          setErrors(data.errors);
          alert(data.msg || 'Please check the form for errors');
        } else if (res.status === 404) {
          alert('Event not found or no longer available');
        } else {
          throw new Error(data.msg || 'Registration failed');
        }
        return;
      }

      alert('Registration successful — thank you!');
      setFormData({ name: '', section: '', regNo: '', mobile: '', eventId: '' });
      setErrors({});
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message || 'Error saving registration. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container event-register-container">
      <div className="card event-register-wrapper">
        <h2>Student Event Registration</h2>
        <p className="muted">Please provide your section, registration number and mobile number to register.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              className={errors.name ? 'error' : ''}
              required 
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="section">Section</label>
              <input 
                id="section" 
                name="section" 
                type="text" 
                value={formData.section} 
                onChange={handleChange}
                className={errors.section ? 'error' : ''} 
                required 
              />
              {errors.section && <span className="error-message">{errors.section}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="regNo">Registration No.</label>
              <input 
                id="regNo" 
                name="regNo" 
                type="text" 
                value={formData.regNo} 
                onChange={handleChange}
                className={errors.regNo ? 'error' : ''} 
                required 
              />
              {errors.regNo && <span className="error-message">{errors.regNo}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input 
              id="mobile" 
              name="mobile" 
              type="tel" 
              pattern="[0-9]{10}"
              value={formData.mobile} 
              onChange={handleChange}
              className={errors.mobile ? 'error' : ''} 
              required 
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Select Event</label>
            {loading ? (
              <p>Loading available events...</p>
            ) : events.length === 0 ? (
              <p>No upcoming events available for registration</p>
            ) : (
              <select 
                id="eventId" 
                name="eventId" 
                value={formData.eventId} 
                onChange={handleChange}
                className={errors.eventId ? 'error' : ''} 
                required
              >
                <option value="">-- Choose event --</option>
                {events.map(ev => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title} - {new Date(ev.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            )}
            {errors.eventId && <span className="error-message">{errors.eventId}</span>}
          </div>

          <div className="form-actions">
            <button 
              className="btn-primary" 
              type="submit" 
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegister;