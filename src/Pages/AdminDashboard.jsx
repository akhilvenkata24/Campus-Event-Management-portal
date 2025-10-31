import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAdminToken, logoutAdmin } from '../utils/auth';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Group registrations by event
  const registrationsByEvent = events.reduce((acc, event) => {
    acc[event._id] = {
      event,
      registrations: registrations.filter(reg => reg.event?._id === event._id)
    };
    return acc;
  }, {});

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsRes, regsRes] = await Promise.all([
          fetch('http://localhost:5000/api/events'),
          fetch('http://localhost:5000/api/registrations', {
            headers: { 'x-auth-token': getAdminToken() }
          })
        ]);
        
        const [eventsData, regsData] = await Promise.all([
          eventsRes.json(),
          regsRes.json()
        ]);
        
        setEvents(eventsData || []);
        setRegistrations(regsData || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, { method: 'DELETE', headers: { 'x-auth-token': getAdminToken() } });
      if (!res.ok) throw new Error('Failed');
      setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const downloadExcel = async (eventId) => {
    const token = getAdminToken();
    if (!token) {
      alert('Please login as admin to download registrations');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/registrations/download/${eventId}`, {
        headers: { 'x-auth-token': token }
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to download');
      }

      const blob = await res.blob();
      const cd = res.headers.get('Content-Disposition') || '';
      const match = cd.match(/filename=(?:"?)([^";]+)/);
      const filename = match ? match[1] : `registrations-${eventId}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Download failed: ' + (err.message || 'Unknown error'));
    }
  };



  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage events and view recent registrations</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link className="btn" to="/admin/create">Create Event</Link>
          <Link className="btn" to="/admin/messages">View Messages</Link>
          <button className="btn" onClick={() => { logoutAdmin(); window.location.href = '/admin/login'; }}>Logout</button>
        </div>
      </div>

      <div className="cards" style={{marginBottom:18}}>
        <div className="card"><h3>Total Events</h3><p>{events.length}</p></div>
        <div className="card"><h3>Upcoming</h3><p>{events.filter(e=>new Date(e.date) > new Date()).length}</p></div>
        <div className="card"><h3>Recent Registrations</h3><p>{registrations.length}</p></div>
      </div>

      <div className="registrations-by-event" style={{marginTop: 20}}>
        <h3>Registrations by Event</h3>
        {loading ? <p>Loading…</p> : (
          Object.entries(registrationsByEvent).map(([eventId, { event, registrations: eventRegs }]) => (
            <div key={eventId} className="event-container card" style={{marginBottom: 15}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <h4 style={{margin: 0}}>{event.title}</h4>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              {eventRegs.length === 0 ? (
                <p className="muted">No registrations for this event</p>
              ) : (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Reg. No</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegs.slice(0, 2).map(reg => (
                        <tr key={reg._id}>
                          <td>{reg.name}</td>
                          <td>{reg.section}</td>
                          <td>{reg.regNo}</td>
                          <td>{reg.mobile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {eventRegs.length > 2 && (
                    <p className="muted" style={{textAlign: 'center', marginTop: 10}}>
                      +{eventRegs.length - 2} more registrations
                    </p>
                  )}
                  <div style={{textAlign: 'center', marginTop: 10}}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => downloadExcel(eventId)}
                    >
                      Download Excel
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>Events</h3>
        {loading ? <p>Loading…</p> : (
          events.length === 0 ? <p className="muted">No events yet</p> : (
            <table className="table">
              <thead>
                <tr><th>Title</th><th>Date</th><th>Category</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev._id || ev.id}>
                    <td>{ev.title || ev.title}</td>
                    <td>{ev.date ? new Date(ev.date).toLocaleDateString() : '—'}</td>
                    <td>{ev.category || '—'}</td>
                    <td style={{display: 'flex', gap: '8px'}}>
                      <button className="btn" onClick={() => navigate(`/admin/events/${ev._id || ev.id}`)}>View</button>
                      <button className="btn" onClick={() => navigate(`/admin/events/${ev._id || ev.id}/edit`)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(ev._id || ev.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
