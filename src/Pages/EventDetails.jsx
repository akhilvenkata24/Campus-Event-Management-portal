import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Don't send admin token for public view
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Event not found');
          }
          throw new Error('Failed to load event');
        }
        const data = await res.json();
        
        // Format the date
        const formattedEvent = {
          ...data,
          formattedDate: new Date(data.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        
        setEvent(formattedEvent);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        alert(err.message);
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  if (loading) return <div className="container">Loading...</div>;
  if (!event) return <div className="container">Event not found</div>;



  return (
    <div className="container">
      <div className="card" style={{maxWidth: 800, margin: '24px auto', padding: '24px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <h2>Event Details</h2>
          <button className="btn" onClick={() => navigate('/events')}>Back to Events</button>
        </div>

        <div style={{marginBottom: 24}}>
          {event.image ? (
            <img 
              src={event.image}
              alt={event.title}
              style={{width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8}}
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
              style={{width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8}}
            />
          )}
        </div>

        <div style={{display: 'grid', gap: 16}}>
          <div>
            <h3>Title</h3>
            <p>{event.title}</p>
          </div>

          <div>
            <h3>Date & Time</h3>
            <p>
              {new Date(event.date).toLocaleDateString()}
              {event.time && ` at ${event.time}`}
            </p>
          </div>

          <div>
            <h3>Location</h3>
            <p>{event.location || 'Not specified'}</p>
          </div>

          <div>
            <h3>Category</h3>
            <p style={{textTransform: 'capitalize'}}>{event.category || 'Not specified'}</p>
          </div>

          <div>
            <h3>Description</h3>
            <p>{event.description || 'No description provided'}</p>
          </div>

          <div>
            <h3>Registrations</h3>
            <p>Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;