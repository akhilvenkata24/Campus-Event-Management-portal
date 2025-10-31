import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Events.css"; 
const Events = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Build query params based on filters
        const params = new URLSearchParams();
        if (activeFilter !== 'all') {
          if (['upcoming', 'completed'].includes(activeFilter)) {
            params.append('status', activeFilter);
          } else {
            params.append('category', activeFilter);
          }
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const response = await fetch(`/api/events?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        alert('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    const timeoutId = setTimeout(fetchEvents, 300); // Debounce searches
    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery]);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const eventsToDisplay = loading ? [] : events.map(event => ({
    ...event,
    id: event._id, // ensure id is consistent
    date: formatDate(event.date),
    status: new Date(event.date) > new Date() ? 'upcoming' : 'completed'
  }));

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'completed', name: 'Past Events' },
    { id: 'technology', name: 'Technology' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'sports', name: 'Sports' },
    { id: 'career', name: 'Career' }
  ];

  const filteredEvents = eventsToDisplay.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.status === activeFilter || event.category === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff3e0', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>Campus Events</h1>
          <p style={{ fontSize: '18px', color: '#555' }}>
            Discover and register for upcoming events on campus. Never miss out on exciting opportunities!
          </p>
        </div>

        {/* Search & Filters */}
        <div style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: '1 1 250px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <div style={{ flex: '2 1 600px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeFilter === category.id ? '#ff9457' : '#fff',
                  color: activeFilter === category.id ? '#fff' : '#555',
                  whiteSpace: 'nowrap'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="loading-spinner"></div>
            <h3 style={{ fontSize: '20px', color: '#555', marginBottom: '8px' }}>Loading events...</h3>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {filteredEvents.map(event => (
              <div key={event.id} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: event.status === 'upcoming' ? '#d1fae5' : '#eee',
                    color: event.status === 'upcoming' ? '#065f46' : '#555',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fff4e5', color: '#e86f36', padding: '4px 8px', borderRadius: '12px' }}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#555' }}>{event.attendees} attending</span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{event.title}</h3>
                  <p style={{ color: '#555', marginBottom: '16px' }}>{event.description}</p>

                  <div style={{ marginBottom: '8px' }}>
                    <strong>Date:</strong> {event.date}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Time:</strong> {event.time}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Location:</strong> {event.location}
                  </div>

                  <button
                    onClick={() => navigate(`/events/${event._id || event.id}`)}
                    style={{
                      backgroundColor: '#ff9457',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <h3 style={{ fontSize: '20px', color: '#555', marginBottom: '8px' }}>No events found</h3>
            <p style={{ color: '#999' }}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
