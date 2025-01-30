import React, { useState } from 'react';
import './Contact.css';
import Header from './Header';
import gpayQR from '../asserts/gpay.jpg';

const Contact = () => {
    const [result, setResult] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResult("Sending....");
        
        const formData = new FormData(event.target);
        formData.append("access_key", "7fd7d8e9-d4a3-4c7a-80ba-870e22857dde");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Message sent successfully! We'll get back to you soon.");
                event.target.reset();
            } else {
                console.log("Error", data);
                setResult(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setResult("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-container">
            <Header />
            {showQR && (
                <div className="qr-popup-overlay" onClick={() => setShowQR(false)}>
                    <div className="qr-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowQR(false)}>×</button>
                        <h3>Scan to Pay ₹20</h3>
                        <img src={gpayQR} alt="Google Pay QR Code" className="qr-code" />
                        <p>Scan this QR code with any UPI app to support me!</p>
                    </div>
                </div>
            )}
            <div className="contact-content">
                <div className="contact-header">
                    <h1>Get in Touch</h1>
                    <p>Have a question or suggestion? We'd love to hear from you!</p>
                </div>

                <div className="contact-form-container">
                    <form onSubmit={onSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="What's this about?"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Your message here..."
                                rows="6"
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>

                        {result && (
                            <div className={`form-result ${result.includes('success') ? 'success' : 'error'}`}>
                                {result}
                            </div>
                        )}
                    </form>

                    <div className="contact-info">
                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div className="info-content">
                                <h3>Address</h3>
                                <p>72, SafaGarden Ukkadam - Coimbatore</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div className="info-content">
                                <h3>Email</h3>
                                <p>mohammedsafil039@gmail.com</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">
                                <i className="fab fa-whatsapp"></i>
                            </div>
                            <div className="info-content">
                                <h3>WhatsApp</h3>
                                <a 
                                    href="https://wa.me/919789378657" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="whatsapp-link"
                                >
                                    +91 97895378657
                                </a>
                            </div>
                        </div>
                        <div className="info-item coffee-item">
                            <div className="info-icon">☕</div>
                            <div className="info-content">
                                <h3>Buy Me a Coffee</h3>
                                <button 
                                    className="coffee-button"
                                    onClick={() => setShowQR(true)}
                                >
                                    Support with ₹20
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
