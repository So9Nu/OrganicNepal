import { Search, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const customers = [
  {
    id: 1,
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+977-9841234567',
    location: 'Kathmandu',
    orders: 5,
    totalSpent: 'रू 12,500',
    joined: '2024-01-15',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+977-9842345678',
    location: 'Lalitpur',
    orders: 3,
    totalSpent: 'रू 8,200',
    joined: '2024-02-20',
  },
  {
    id: 3,
    name: 'Anish Patel',
    email: 'anish@example.com',
    phone: '+977-9843456789',
    location: 'Bhaktapur',
    orders: 7,
    totalSpent: 'रू 18,900',
    joined: '2024-01-05',
  },
  {
    id: 4,
    name: 'Dina Rai',
    email: 'dina@example.com',
    phone: '+977-9844567890',
    location: 'Pokhara',
    orders: 2,
    totalSpent: 'रू 4,500',
    joined: '2024-03-10',
  },
];

export default function AdminCustomers() {
  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest-900 mb-2">Customers</h1>
        <p className="text-forest-600">Manage and view all your customers</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-forest-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-forest-100 bg-forest-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-700">Joined</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-forest-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className="border-b border-forest-100 hover:bg-primary-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-forest-900">{customer.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-forest-600">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-forest-600">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-forest-600">
                      <MapPin size={14} />
                      {customer.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-forest-900">{customer.totalSpent}</td>
                  <td className="px-6 py-4 text-sm text-forest-600">{customer.joined}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-forest-100 text-forest-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
