import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { User, Phone, MapPin, Package, LogOut, Edit2, Save, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5008/api';

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // ✅ Pull name & phone directly from auth context (set during login)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || user?.phoneNumber || '',
    address: user?.address || 'Kathmandu, Nepal',
  });

  // ✅ Sync if user context updates after mount
  useEffect(() => {
    if (user) {
      let savedProfile = {};
      try { savedProfile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || '{}'); } catch { savedProfile = {}; }
      setFormData({
        name: user.name || savedProfile.name || '',
        phone: user.phone || user.phoneNumber || savedProfile.phone || '',
        address: savedProfile.address || user.address || 'Kathmandu, Nepal',
      });
    }
  }, [user]);

  const [orders, setOrders] = useState([]);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
        .then(response => response.ok ? response.json() : Promise.reject(new Error('Unable to load orders')))
        .then(setOrders)
        .catch(() => setOrders([]));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveError('');
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ name: formData.name, phone: formData.phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save profile');
      updateUser(data.user);
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(formData));
      setIsEditingProfile(false);
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? order.total ?? 0), 0);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile and view order history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
                  {formData.name || 'Guest'}
                </h2>
                <p className="text-center text-green-600 font-medium mb-6">Premium Member</p>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center text-gray-700">
                    <Package className="w-5 h-5 mr-3 text-green-600" />
                    <span className="text-sm">{orders.length} Total Orders</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Total Spent</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Profile Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  Account Information
                </h3>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formData.name || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formData.phone || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formData.address || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                  </div>
                )}
              </div>

              {/* Orders Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  Order History
                </h3>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Order ID</p>
                            <p className="font-semibold text-gray-900">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Order Date</p>
                            <p className="font-semibold text-gray-900">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                            <p className="font-semibold text-green-600">₹{Number(order.totalAmount ?? order.total ?? 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Items</p>
                          <p className="text-gray-700">
                            {Array.isArray(order.items)
                              ? order.items.map(i => i.name || `Product #${i.productId || i.id}`).join(', ')
                              : order.items || 'View order details for items'}
                          </p>
                        </div>
                        <button className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm">
                          View Details →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No orders yet</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="mt-4 text-green-600 hover:text-green-700 font-medium"
                    >
                      Start Shopping →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
