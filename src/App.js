import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Events from './Pages/Events';
import EventRegister from './Pages/EventRegister';
import CreateEvent from './Pages/CreateEvent';
import AdminDashboard from './Pages/AdminDashboard';
import AdminLogin from './Pages/AdminLogin';
import EventDetails from './Pages/EventDetails';
import EventView from './Pages/EventView';
import EditEvent from './Pages/EditEvent';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import AdminMessages from './Pages/AdminMessages';
import { isAdminAuthenticated } from './utils/auth';

function App() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <Router>
      <header className="site-header">
        <div className="container header-inner">
          <h1 className="brand">Campus Event Hub</h1>
          <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setNavOpen(o=>!o)}>
            ☰
          </button>
          <nav className={`navbar ${navOpen ? 'open' : ''}`} onClick={() => setNavOpen(false)}>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/register">Register</Link>
            <Link to="/admin/login">Admin</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventView />} />
          <Route path="/register" element={<EventRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={isAdminAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/create" element={isAdminAuthenticated() ? <CreateEvent /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/events/:id" element={isAdminAuthenticated() ? <EventDetails /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/events/:id/edit" element={isAdminAuthenticated() ? <EditEvent /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/messages" element={isAdminAuthenticated() ? <AdminMessages /> : <Navigate to="/admin/login" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 Campus Event Hub. All rights reserved.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
