import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartDrawer from '../shop/CartDrawer';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-glass py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors shadow-glow">
                <Leaf size={22} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-forest-800 leading-none block">Organic</span>
                <span className="font-bold text-xl text-primary-600 leading-none block">Nepal</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-forest-700 hover:bg-forest-50 hover:text-primary-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-48 px-4 py-2 rounded-full text-sm border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-forest-600 hover:text-forest-900">
                      <X size={18} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-forest-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-forest-800">{user.name.split(' ')[0]}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
                      <div className="p-4 border-b border-primary-100">
                        <p className="font-semibold text-forest-800">{user.name}</p>
                        <p className="text-xs text-forest-500">{user.email}</p>
                      </div>
                      <div className="p-2">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-forest-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-forest-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          <User size={16} />
                          My Account
                        </Link>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex btn-primary text-sm py-2 px-5"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-forest-700 hover:bg-forest-100 transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary-100 pt-4 space-y-1 animate-fade-in">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-forest-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold text-sm text-primary-700 bg-primary-50"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}
