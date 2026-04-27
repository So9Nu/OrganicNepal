import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut,
  Leaf, Bell, Menu, X, ChevronDown, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-forest-900 flex flex-col
      transform transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-forest-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white leading-none block text-sm">Organic</span>
            <span className="font-bold text-primary-400 leading-none block text-sm">Nepal Admin</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'text-forest-300 hover:bg-forest-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-forest-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-forest-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-forest-300 hover:bg-forest-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-cream-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="glass-card h-16 flex items-center justify-between px-6 border-b border-primary-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-primary-50">
              <Menu size={20} className="text-forest-700" />
            </button>
            <div>
              <h1 className="font-bold text-forest-800 text-sm">
                {NAV_ITEMS.find(n => n.to === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-forest-500">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors">
              <Bell size={18} className="text-forest-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/" className="text-xs text-primary-600 hover:underline font-medium">View Site →</Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
