import { useState } from 'react';
import "./Events.css"; 
const Events = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    {
      id: 1,
      title: "Hackathon 2025",
      date: "March 20, 2025",
      time: "10:00 AM - 6:00 PM",
      location: "Main Auditorium",
      description: "A 24-hour coding competition for students. Show off your programming skills and win exciting prizes!",
      status: "upcoming",
      category: "technology",
      attendees: 120,
      image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Robotics Workshop",
      date: "April 5, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Lab 101",
      description: "Hands-on training on building autonomous robots. No prior experience required!",
      status: "upcoming",
      category: "workshop",
      attendees: 85,
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Cultural Fest",
      date: "April 15, 2025",
      time: "11:00 AM - 9:00 PM",
      location: "College Grounds",
      description: "Annual cultural festival with performances, food, and competitions from around the world.",
      status: "upcoming",
      category: "cultural",
      attendees: 350,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Tech Symposium",
      date: "February 15, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Conference Hall",
      description: "Discussion on latest tech trends and innovations with industry experts.",
      status: "completed",
      category: "technology",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      title: "Sports Tournament",
      date: "January 30, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "Sports Complex",
      description: "Annual inter-department sports competition with various games and activities.",
      status: "completed",
      category: "sports",
      attendees: 180,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      title: "Career Fair",
      date: "March 5, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Main Hall",
      description: "Connect with top companies and explore job opportunities. Bring your resume!",
      status: "upcoming",
      category: "career",
      attendees: 300,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

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

  const filteredEvents = events.filter(event => {
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
        {filteredEvents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {filteredEvents.map(event => (
              <div key={event.id} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

                  <button style={{
                    backgroundColor: '#ff9457',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
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
