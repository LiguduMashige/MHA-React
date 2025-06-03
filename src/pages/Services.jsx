import React, { useState } from 'react';
import { FaFire, FaSprayCan, FaChair, FaGift, FaCheckCircle } from 'react-icons/fa';
import '../styles/Services.css';

const servicesData = [
  {
    icon: <FaFire />,
    title: 'Custom Candle Making',
    description: 'We create bespoke candles for special events and occasions. Choose your container, scent, and design for a truly personalized experience.',
    videoUrl: 'https://www.youtube.com/embed/3OWmStalE0g' // Embed URL format
  },
  {
    icon: <FaSprayCan />,
    title: 'Scent Consultations',
    description: 'Not sure which scent is right for your space? Our scent consultations help you discover the perfect fragrance profile for your home or event.',
    videoUrl: 'https://www.youtube.com/embed/N2mxWnMF5b0' // Embed URL format
  },
  {
    icon: <FaChair />,
    title: 'Interior Styling',
    description: 'Our interior styling service helps you integrate our home accessories into your existing decor for a cohesive and beautiful living space.',
    videoUrl: 'https://www.youtube.com/embed/jH4JU7Ihaa8' // Embed URL format
  },
  {
    icon: <FaGift />,
    title: 'Corporate Gifting',
    description: 'Make an impression with custom corporate gifts. We create branded home accessories perfect for client appreciation, employee recognition, and events.',
    videoUrl: 'https://www.youtube.com/embed/mRzN3Ztnobc' // Embed URL format
  }
];

const Services = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.email.includes('@')) errors.email = 'Please enter a valid email';
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // In a real app, you would send the form data to your backend here
    console.log('Form submitted:', formData);
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        service: '',
        message: ''
      });
    }, 3000);
  };
  
  return (
    <div className="services-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Our Services</h1>
          <p className="hero-description">
            Beyond our product offerings, we provide specialized services to enhance your home and create memorable experiences.
          </p>
        </div>
      </section>
      
      <section className="mission-section">
        <h2 className="section-title">Our Mission</h2>
        <p className="mission-text">
          At Masibonge Home Accessories, we believe that your home should be a reflection of your personality and style. 
          Our mission is to create beautiful, high-quality home accessories that bring warmth, comfort, and a touch of luxury to your living spaces.
        </p>
        <p className="mission-text">
          We are committed to sustainable practices, using eco-friendly materials and processes whenever possible. 
          Each product is carefully crafted with attention to detail, ensuring that you receive only the best for your home.
        </p>
      </section>
      
      <div className="services-grid">
        {servicesData.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon-container">
              {service.icon}
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="video-container">
              <iframe 
                width="100%" 
                height="100%" 
                src={service.videoUrl} 
                title={service.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
      
      <section className="contact-section">
        <h2 className="section-title">Request a Service</h2>
        <p className="contact-text">
          Interested in our services? Fill out the form below and we'll get back to you within 24 hours to discuss your needs.
        </p>
        
        {isSubmitted ? (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <h3>Request Sent!</h3>
            <p>Thank you for your interest. We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  className={`form-input ${formErrors.name ? 'error' : ''}`} 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className={`form-input ${formErrors.email ? 'error' : ''}`} 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email" 
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Service Interested In</label>
              <select 
                className="form-select"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
              >
                <option value="">Select a Service</option>
                {servicesData.map((service, index) => (
                  <option key={index} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className={`form-textarea ${formErrors.message ? 'error' : ''}`}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Tell us about your needs and how we can help"
              />
              {formErrors.message && <div className="error-message">{formErrors.message}</div>}
            </div>
            
            <button className="submit-button" type="submit">Send Request</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Services;
