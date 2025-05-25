import React from "react";
import { PhoneCall, Mail, LifeBuoy } from "lucide-react";
import "./help.css";

const HelpAndSupport = () => {
  return (
    <div className="help-wrapper">
      <h1 className="help-heading">💬 Help & Support Center</h1>
      <p className="help-subtext">
        We’re here for you anytime. Reach out to us through any of the following ways:
      </p>

      <div className="help-grid">
        <div className="help-card">
          <PhoneCall className="help-icon" />
          <h3>Call Us</h3>
          <p>📞 +91 9720271675</p>
          <span className="availability">24/7 Support Line</span>
        </div>

        <div className="help-card">
          <Mail className="help-icon" />
          <h3>Email Support</h3>
          <p>✉️ support@lmsportal.com</p>
          <span className="availability">Reply within 24 hours</span>
        </div>

        <div className="help-card">
          <LifeBuoy className="help-icon" />
          <h3>Live Chat</h3>
          <p>💻 Chat with our assistant</p>
          <span className="availability">9 AM – 6 PM (Mon–Fri)</span>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
