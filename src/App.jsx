import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/shop/HomePage';
import ShopPage from './pages/shop/ShopPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import AboutPage from './pages/shop/AboutPage';
import ContactPage from './pages/shop/ContactPage';
import AccountPage from './pages/account/AccountPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// Protected route for admin
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Protected route for authenticated users
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/admin" element={<LoginPage adminRoute={true} />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
