import { useEffect, useMemo, useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5008/api';
export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to load customers'); return data; })
      .then(users => setCustomers(users.filter(user => user.role === 'user'))).catch(err => setError(err.message));
  }, [token]);
  const filtered = useMemo(() => customers.filter(customer => [customer.name, customer.email, customer.phone].some(value => value?.toLowerCase().includes(search.toLowerCase()))), [customers, search]);
  return <AdminLayout><div className="mb-8"><h1 className="text-2xl font-bold text-forest-900 mb-2">Customers</h1><p className="text-forest-600">Live customer accounts from the database</p></div><div className="mb-6 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search customers..." className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-forest-200" /></div>{error && <p className="mb-4 text-sm text-red-700">{error}</p>}<div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-forest-100 bg-forest-50"><th className="px-6 py-4 text-left text-sm">Customer</th><th className="px-6 py-4 text-left text-sm">Contact</th><th className="px-6 py-4 text-left text-sm">Joined</th></tr></thead><tbody>{filtered.map(customer => <tr key={customer.id} className="border-b border-forest-100"><td className="px-6 py-4 font-medium">{customer.name || 'Unnamed customer'}</td><td className="px-6 py-4"><div className="space-y-1 text-sm text-forest-600"><div className="flex gap-2"><Mail size={14} />{customer.email}</div>{customer.phone && <div className="flex gap-2"><Phone size={14} />{customer.phone}</div>}</div></td><td className="px-6 py-4 text-sm">{new Date(customer.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>{!error && !customers.length && <p className="p-8 text-center text-forest-500">No customers yet.</p>}</div></AdminLayout>;
}
