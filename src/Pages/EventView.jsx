import { useState, useEffect } from 'react';
import config from '../config';
import { useParams, useNavigate } from 'react-router-dom';

const EventView = () => {
  const defaultImage = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80';
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
  const res = await fetch(`${config.API_URL}/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        
        // Preload the image
        if (data.image) {
          const img = new Image();
          img.src = data.image;
          img.onload = () => {
            setEvent(data);
            setLoading(false);
          };
          img.onerror = () => {
            // If image fails to load, use default image
            data.image = defaultImage;
            setEvent(data);
            setLoading(false);
          };
        } else {
          data.image = defaultImage;
          setEvent(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setLoading(false);
        alert('Event not found');
        navigate('/events');
      }
    };
    fetchEvent();
  }, [id, navigate, defaultImage]);

  if (loading) return (
    <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
      <h3>Loading event details...</h3>
    </div>
  );

  if (!event) return (
    <div className="container" style={{ padding: '48px 24px', textAlign: 'center' }}>
      <h3>Event not found</h3>
      <button className="btn" onClick={() => navigate('/events')} style={{ marginTop: '16px' }}>
        Back to Events
      </button>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        {/* Event Image */}
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          {event.image ? (
            <img 
              src={event.image}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                console.error('Failed to load image:', event.image);
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80';
              }}
            />
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80"
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <button
            onClick={() => navigate('/events')}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Back to Events
          </button>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: event.status === 'upcoming' ? '#d1fae5' : '#eee',
            color: event.status === 'upcoming' ? '#065f46' : '#555',
            fontWeight: 'bold'
          }}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </div>
        </div>

        {/* Event Details */}
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#fff4e5',
                color: '#e86f36',
                padding: '4px 12px',
                borderRadius: '12px'
              }}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>
              {event.attendees && (
                <span style={{ color: '#666' }}>
                  {event.attendees} attending
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>{event.title}</h1>
            <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>{event.description}</p>
          </div>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Date & Time</h3>
              <p style={{ color: '#555' }}>
                {new Date(event.date).toLocaleDateString()}
                {event.time && ` at ${event.time}`}
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Location</h3>
              <p style={{ color: '#555' }}>{event.location}</p>
            </div>
          </div>

          {event.status === 'upcoming' && (
            <button
              onClick={() => navigate(`/register?event=${event._id}`)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff9457',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Register for this Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventView;