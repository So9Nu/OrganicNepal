import { useState } from 'react';
import { Search } from 'lucide-react';
import { orders } from '../../data/mockData';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-forest-800">Orders ({filtered.length})</h2>
        <div className="flex gap-2 flex-wrap">
          {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID or customer..."
          className="input-field pl-10 text-sm"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-100">
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Order ID</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Customer</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700 hidden sm:table-cell">Date</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700 hidden md:table-cell">Items</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Total</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Status</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="py-4 px-5 font-mono font-semibold text-forest-800">{order.id}</td>
                  <td className="py-4 px-5 text-forest-700">{order.customer}</td>
                  <td className="py-4 px-5 text-forest-500 hidden sm:table-cell">{order.date}</td>
                  <td className="py-4 px-5 text-forest-600 hidden md:table-cell">{order.items} items</td>
                  <td className="py-4 px-5 font-bold text-primary-700">रू {order.total.toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <select className="text-xs border border-primary-200 rounded-lg px-2 py-1.5 text-forest-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400">
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-forest-500">No orders found matching your criteria.</div>
        )}
      </div>
    </AdminLayout>
  );
}
