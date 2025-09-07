import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Plain CSS file

// Home page component
const Home = () => {
  const events = [
    { title: "Hackathon 2025", date: "March 20, 2025", location: "Main Auditorium", description: "A 24-hour coding competition for students." },
    { title: "Robotics Workshop", date: "April 5, 2025", location: "Lab 101", description: "Hands-on training on building autonomous robots." },
    { title: "Cultural Fest", date: "April 15, 2025", location: "College Grounds", description: "Annual cultural festival with performances, food, and competitions." }
  ];

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to <span className="highlight">Campus Event Hub</span></h1>
        <p>Discover, register, and manage all campus events in one place. Never miss out on exciting opportunities again!</p>
        <Link to="/events" className="btn">Explore Events</Link>
      </section>

      <section className="events-preview">
        <h2>Upcoming Events</h2>
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <h3>{event.title}</h3>
              <span className="status">Upcoming</span>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>{event.description}</p>
              <button className="btn-small">Register Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Events page component
const Events = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const events = [
    { id: 1, title: "Hackathon 2025", date: "March 20, 2025", location: "Main Auditorium", description: "A 24-hour coding competition.", status: "upcoming", category: "technology" },
    { id: 2, title: "Robotics Workshop", date: "April 5, 2025", location: "Lab 101", description: "Hands-on training on building autonomous robots.", status: "upcoming", category: "workshop" },
    { id: 3, title: "Cultural Fest", date: "April 15, 2025", location: "College Grounds", description: "Annual cultural festival.", status: "upcoming", category: "cultural" }
  ];

  const categories = ['all', 'upcoming', 'completed', 'technology', 'workshop', 'cultural'];

  const filteredEvents = events.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.status === activeFilter || event.category === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="events-page">
      <h1>Campus Events</h1>
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={activeFilter === category ? "active" : ""}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

// About page component
const About = () => (
  <div className="about-page">
    <h2>About Campus Event Hub</h2>
    <p>Campus Event Hub is your one-stop solution for discovering and registering for events happening on campus.</p>
  </div>
);

// Contact page component
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" id="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <textarea id="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

// Login page component
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successful!");
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Register page component
const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Registration successful!");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <footer className="footer">
        <p>© 2025 Campus Event Hub. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
