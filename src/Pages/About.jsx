import React from "react";
import "./About.css"; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <section className="about-section" aria-labelledby="about-heading">
        <h2 id="about-heading" className="about-heading">
          About Campus Event Hub
        </h2>
        <p className="about-text">
          Campus Event Hub is your one-stop solution for discovering and registering for events happening on campus. Whether it's a tech fest, workshop, sports day, or cultural night — we've got you covered.
        </p>
        <p className="about-text">
          Our goal is to simplify event management for students and faculty by offering a centralized platform for all event-related activities. Stay updated, stay connected, and never miss out on exciting opportunities around you!
        </p>

        <h3 className="about-subheading">Why Choose Us?</h3>
        <ul className="about-list">
          <li>📅 Easy event discovery and registration</li>
          <li>📢 Instant updates and notifications</li>
          <li>🤝 Seamless collaboration with organizers</li>
          <li>🔒 Secure and student-friendly platform</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
