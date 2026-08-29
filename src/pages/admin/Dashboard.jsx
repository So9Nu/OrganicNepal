import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5008/api';
const icons = [TrendingUp, ShoppingBag, Users, Package];
export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { fetch(`${API}/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message); return data; }).then(setSummary).catch(err => setError(err.message)); }, [token]);
  const counts = summary?.counts || {};
  const cards = [['Total Revenue', `रू ${Number(counts.revenue || 0).toLocaleString()}`], ['Total Orders', counts.orders || 0], ['Customers', counts.customers || 0], ['Products Listed', counts.products || 0]];
  return <AdminLayout><h2 className="text-xl font-bold text-forest-800 mb-6">Dashboard</h2>{error && <p className="mb-4 text-red-700">{error}</p>}<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">{cards.map(([title, value], index) => { const Icon = icons[index]; return <div key={title} className="glass-card rounded-2xl p-5"><Icon className="text-primary-600 mb-4" size={22} /><p className="text-2xl font-bold text-forest-800">{summary ? value : '—'}</p><p className="text-sm text-forest-500 mt-1">{title}</p></div>; })}</div><div className="grid lg:grid-cols-2 gap-6"><section className="glass-card rounded-2xl p-6"><h3 className="font-bold mb-4">Recent Orders</h3>{summary?.recentOrders?.length ? summary.recentOrders.map(order => <div key={order.id} className="flex justify-between py-3 border-b border-primary-50"><div><p className="font-semibold">#{order.id} · {order.name}</p><p className="text-xs text-forest-500">{order.itemCount} items · {order.status}</p></div><p className="font-bold text-primary-700">रू {Number(order.totalAmount).toLocaleString()}</p></div>) : <p className="text-forest-500">No orders yet.</p>}</section><section className="glass-card rounded-2xl p-6"><h3 className="font-bold mb-4">Product Categories</h3>{summary?.categoryData?.length ? summary.categoryData.map(category => <div key={category.name} className="flex justify-between py-3 border-b border-primary-50 capitalize"><span>{category.name}</span><strong>{category.value} products</strong></div>) : <p className="text-forest-500">No products yet.</p>}</section></div></AdminLayout>;
}
