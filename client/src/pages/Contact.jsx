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
    <div className="contact-page">
      <h1>Get in Touch</h1>

      <div className="contact-info">
        <div>
          <h3>Address</h3>
          <p>
            Higher Education Loans and Scholarships Board <br />
            Plot No. 8, Second Floor, United Church of Zambia Synod, <br />
            Mosi-O-Tunya Road, P.O Box 320298, Woodlands, Lusaka, Zambia.
          </p>
        </div>
        <div>
          <h3>Phone</h3>
          <p>
            Tel: +260 211-250 726 <br />
            Loan Recoveries Hotline (Strictly): +260 770 901 243
          </p>
        </div>
        <div>
          <h3>Email</h3>
          <p>
            General: info@helsb.gov.zm <br />
            Partnerships: Partnerships@helsb.gov.zm
          </p>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
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
        </div>
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
