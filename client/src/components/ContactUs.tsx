import axios from 'axios';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      await axios.post('https://sheetdb.io/api/v1/hq2ny9kc26ejo', {
        data: formData,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = "918789698369";
  
  const openWhatsApp = () => {
    try {
      const message = encodeURIComponent("Hi, I'd like to know more about UntraddCareer program.");
      const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-bold text-blue-700 mb-6">Get in Touch</h3>
        
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
              <Send className="text-green-600" size={24} />
            </div>
            <h4 className="text-lg font-medium text-green-800 mb-2">Message Sent!</h4>
            <p className="text-green-700 mb-4">Thank you for reaching out. We'll get back to you shortly.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Your phone number (optional)"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="How can we help you?"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 
                ${isSubmitting 
                  ? 'bg-blue-400 text-white cursor-wait' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'}`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-blue-700 mb-6">Contact Information</h3>
        
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
              <Mail size={18} />
              Email Us
            </h4>
            <a 
              href="mailto:contactuntradd@gmail.com" 
              className="text-blue-600 hover:underline"
            >
              contactuntradd@gmail.com
            </a>
            <p className="text-sm text-slate-600 mt-1">We typically respond within 24 hours</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-5">
            <h4 className="font-bold text-green-700 flex items-center gap-2 mb-3">
              <MessageSquare size={18} />
              WhatsApp
            </h4>
            <button
              onClick={openWhatsApp}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Chat Now
            </button>
            <p className="text-sm text-slate-600 mt-2">Available 24/7 for immediate assistance</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-5">
            <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
              <Phone size={18} />
              Call Us
            </h4>
            <a 
              href="tel:+918789698369" 
              className="text-blue-600 hover:underline"
            >
              +91 8789 698 369
            </a>
            <p className="text-sm text-slate-600 mt-1">Monday-Friday, 9am-6pm IST</p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-5">
            <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
              <MapPin size={18} />
              Office Address
            </h4>
            <address className="not-italic text-slate-600">
              UntraddCareer<br />
              Thuberhalli, Whitefield<br />
              Bangalore, Karnataka 560066<br />
              India
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 