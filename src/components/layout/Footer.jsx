import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Leaf size={22} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white leading-none block">Organic</span>
                <span className="font-bold text-lg text-primary-400 leading-none block">Nepal</span>
              </div>
            </Link>
            <p className="text-forest-300 text-sm leading-relaxed mb-6">
              Connecting you directly with Nepali organic farmers. Fresh, healthy, and sustainably sourced produce delivered to your door.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full bg-forest-700 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                { label: 'About Us', to: '/about' },
                { label: 'Our Farms', to: '/farms' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-forest-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-5">Categories</h3>
            <ul className="space-y-3">
              {[
                { label: ' Vegetables', to: '/shop?category=vegetables' },
                { label: ' Fruits', to: '/shop?category=fruits' },
                { label: ' Dairy', to: '/shop?category=dairy' },
                { label: ' Grains', to: '/shop?category=grains' },
                { label: ' Spices', to: '/shop?category=spices' },
              ].map(cat => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className="text-forest-300 hover:text-primary-400 text-sm transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-forest-300 text-sm">Balkhu, Kathmandu<br />Nepal, 44600</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+977981234567" className="text-forest-300 hover:text-primary-400 text-sm transition-colors">
                  +977 98-1234-5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:hello@organicnepal.com" className="text-forest-300 hover:text-primary-400 text-sm transition-colors">
                  hello@organicnepal.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">Newsletter</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-forest-800 border border-forest-700 text-sm text-white placeholder-forest-400 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-lg transition-colors font-medium"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-forest-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-forest-400 text-sm">
            © 2025 Organic Nepal. All rights reserved to BCA 5th Semester Project .
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map(item => (
              <a key={item} href="#" className="text-forest-400 hover:text-primary-400 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
