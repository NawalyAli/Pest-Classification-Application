import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";

const faqs = [
  { question: "How do I upload an image for classification?", answer: "Click on the upload button, select an image, and wait for the classification result." },
  { question: "What types of pests can be identified?", answer: "The system can identify over 100 types of pests from various agricultural environments." },
  { question: "Why is my image not uploading?", answer: "Ensure that the image format is JPG or PNG and the file size is under 5MB." },
  { question: "How accurate is the classification?", answer: "Accuracy depends on the image quality and the trained model. Results may vary." },
  { question: "Can I report incorrect classifications?", answer: "Yes! Please use the form below to report incorrect classifications or issues." },
];

export default function HelpPage() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setSubmitted(true);
      setMessage("");
    }
  };

  return (
    <div className="help-container">
      {/* Go Back Button */}
      <button className="go-back-button" onClick={() => navigate(-1)}>⬅ Go Back</button>

      <h1>Help & FAQ</h1>

      {/* FAQ Section */}
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Help Request Form */}
      <div className="help-form">
        <h2>Need More Help?</h2>
        {submitted ? (
          <p className="success-message">Thank you! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your question or issue here..."
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}
