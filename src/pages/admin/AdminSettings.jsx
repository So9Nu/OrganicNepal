import { Save, Lock, Bell, Eye, Globe, Shield } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Organic Nepal',
    email: 'admin@organicnepal.com',
    phone: '+977-1-4123456',
    address: 'Kathmandu, Nepal',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest-900 mb-2">Settings</h1>
        <p className="text-forest-600">Manage your store and account settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-100 text-primary-700 font-medium text-left transition-all">
              <Globe size={18} />
              Store Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-forest-600 hover:bg-forest-100 font-medium text-left transition-all">
              <Lock size={18} />
              Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-forest-600 hover:bg-forest-100 font-medium text-left transition-all">
              <Bell size={18} />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-forest-600 hover:bg-forest-100 font-medium text-left transition-all">
              <Shield size={18} />
              Privacy & Safety
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Settings */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-forest-900 mb-6 flex items-center gap-2">
              <Globe size={20} />
              Store Settings
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleSettingChange('storeName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your store name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Store address"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="NPR">Nepali Rupee (रू)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="INR">Indian Rupee (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                    <option value="UTC">UTC (UTC+0)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-forest-900 mb-6 flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
