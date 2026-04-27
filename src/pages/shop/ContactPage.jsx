import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-hero-pattern py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Get in <span className="text-primary-300">Touch</span></h1>
          <p className="text-white/75 text-lg">Have a question? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="section-title text-2xl">Contact <span className="text-gradient">Info</span></h2>
            {[
              { icon: Phone, label: 'Phone', value: '+977 98-1234-5678', href: 'tel:+977981234567' },
              { icon: Mail, label: 'Email', value: 'hello@organicnepal.com', href: 'mailto:hello@organicnepal.com' },
              { icon: MapPin, label: 'Address', value: 'Thamel, Kathmandu, Nepal 44600', href: '#' },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat: 8AM–8PM', href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="flex items-start gap-4 p-4 glass-card rounded-2xl hover:shadow-card transition-shadow group">
                <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                  <Icon size={20} className="text-primary-700 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-500 uppercase">{label}</p>
                  <p className="font-medium text-forest-800">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-forest-800 mb-2">Message Sent!</h3>
                <p className="text-forest-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-bold text-forest-800 text-2xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Name</label>
                      <input
                        name="name" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required className="input-field" placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Email</label>
                      <input
                        name="email" type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required className="input-field" placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-1.5">Subject</label>
                    <select
                      name="subject" value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select a topic</option>
                      <option>Order Issue</option>
                      <option>Product Quality</option>
                      <option>Delivery Problem</option>
                      <option>Partnership / Farm</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-1.5">Message</label>
                    <textarea
                      name="message" value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      required rows={5} className="input-field resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
