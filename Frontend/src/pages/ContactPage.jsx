import React from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary mb-4">Contact Us</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Have questions about our ATS scoring engine? Let us know. We usually reply within 24-48 hours.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Email</h4>
                <a href="mailto:skmdsadiq1607@gmail.com" className="text-sm text-text-primary hover:underline">skmdsadiq1607@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Feedback</h4>
                <a href="mailto:skmdsadiq1607@gmail.com" className="text-sm text-text-primary hover:underline">skmdsadiq1607@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Links</h4>
                <a href="https://sxdiq.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Developer Portfolio</a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 rounded-lg border border-surface-border bg-surface-card shadow-sm">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Your Name</label>
              <input type="text" placeholder="John Doe" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Email Address</label>
              <input type="email" placeholder="john@example.com" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Message</label>
              <textarea rows="4" placeholder="How can we help?" className="input-field text-sm resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
