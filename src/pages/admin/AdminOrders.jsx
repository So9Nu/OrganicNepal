import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5008/api';
const STATUS_COLORS = { pending: 'bg-gray-100 text-gray-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-amber-100 text-amber-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to load orders'); return data; })
      .then(setOrders).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [token]);
  const filtered = useMemo(() => orders.filter(order => (
    (statusFilter === 'all' || order.status === statusFilter) &&
    [String(order.id), order.name, order.email].some(value => value?.toLowerCase().includes(search.toLowerCase()))
  )), [orders, search, statusFilter]);
  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API}/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to update order');
      setOrders(current => current.map(order => order.id === orderId ? { ...order, status } : order));
    } catch (err) { setError(err.message); }
  };
  return <AdminLayout><div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"><h2 className="text-xl font-bold text-forest-800">Orders ({filtered.length})</h2><div className="flex gap-2 flex-wrap">{['all', ...STATUSES].map(status => <button key={status} onClick={() => setStatusFilter(status)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusFilter === status ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'}`}>{status}</button>)}</div></div><div className="relative mb-5"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by order ID or customer..." className="input-field pl-10 text-sm" /></div>{error && <p className="mb-4 text-sm text-red-700">{error}</p>}<div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-primary-50 border-b border-primary-100"><th className="text-left py-4 px-5">Order</th><th className="text-left py-4 px-5">Customer</th><th className="text-left py-4 px-5 hidden sm:table-cell">Date</th><th className="text-left py-4 px-5">Total</th><th className="text-left py-4 px-5">Status</th><th className="text-left py-4 px-5">Update</th></tr></thead><tbody>{filtered.map(order => <tr key={order.id} className="border-b border-primary-50"><td className="py-4 px-5 font-mono">#{order.id}</td><td className="py-4 px-5">{order.name || order.email}</td><td className="py-4 px-5 hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString()}</td><td className="py-4 px-5 font-bold text-primary-700">रू {Number(order.totalAmount).toLocaleString()}</td><td className="py-4 px-5"><span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span></td><td className="py-4 px-5"><select value={order.status} onChange={event => updateStatus(order.id, event.target.value)} className="border rounded-lg p-1.5 capitalize">{STATUSES.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>{loading && <p className="p-8 text-center">Loading orders…</p>}{!loading && !filtered.length && <p className="p-8 text-center">No orders found.</p>}</div></AdminLayout>;
}
