import { useState } from "react";
import "./EventRegister.css"; // Import the CSS

const EventRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    event: "",
    comments: "",
  });

  const events = [
    { id: "1", name: "Tech Symposium 2025" },
    { id: "2", name: "Annual Sports Meet" },
    { id: "3", name: "Cultural Fest" },
    { id: "4", name: "Workshop on Web Development" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Registration Successful!");
    console.log("Form Data:", formData);
    setFormData({
      fullName: "",
      email: "",
      studentId: "",
      event: "",
      comments: "",
    });
  };

  return (
    <div className="event-register-container">
      <div className="event-register-wrapper">
        <h2>Register for an Event</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
          />

          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Your student ID"
            required
          />

          <label htmlFor="event">Select Event</label>
          <select
            id="event"
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>

          <label htmlFor="comments">Additional Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Any special requirements..."
          />

          <button type="submit">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

export default EventRegister;
