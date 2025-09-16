import React, { useState } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-us">
      <h2>Get in Touch</h2>
      <p>
        <strong>Address:</strong> Higher Education Loans and Scholarships Board Plot No. 8, Second Floor, United Church of Zambia Synod, Mosi-O-Tunya Road, P.O Box 320298, Woodlands, Lusaka, Zambia.
      </p>
      <p>
        <strong>Phone:</strong> Tel +260 211-250 726 | Loan Recoveries Hotline (Strictly) +260 770 901 243
      </p>
      <p>
        <strong>Email:</strong> General: info@helsb.gov.zm | Partnerships: Partnerships@helsb.gov.zm
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Your Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactUs;
