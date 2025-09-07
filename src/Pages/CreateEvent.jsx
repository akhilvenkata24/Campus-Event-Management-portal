import { useState } from "react";
import "./CreateEvent.css"; // Import the CSS

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    description: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 Event Created Successfully!\n\n" + JSON.stringify(formData, null, 2));
    setFormData({
      eventName: "",
      date: "",
      time: "",
      location: "",
      description: "",
      department: "",
    });
  };

  return (
    <div className="create-event-container">
      <div className="create-event-wrapper">
        <h2>Create New Event</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="eventName">📛 Event Name</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
            required
          />

          <div className="flex-row">
            <div>
              <label htmlFor="date">📅 Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="time">⏰ Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="location">📍 Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter venue or link"
            required
          />

          <label htmlFor="description">📝 Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description..."
            required
          />

          <label htmlFor="department">🏫 Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="civil">Civil</option>
          </select>

          <button type="submit">Create Event</button>
          <p>Make sure all event details are accurate before submission.</p>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
