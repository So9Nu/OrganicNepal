import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit3, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5008/api'}/products`;
const EMPTY = { name: '', nepali: '', category: '', price: '', originalPrice: '', unit: '', description: '', farm: '', location: '', image: '', inStock: true, featured: false };
const bool = value => value === true || value === 1 || value === '1';
const normalize = product => ({
  ...product,
  name: product.name || '',
  nepali: product.nepali || '',
  category: product.category || '',
  unit: product.unit || '',
  description: product.description || '',
  farm: product.farm || '',
  location: product.location || '',
  image: product.image || '',
  price: Number(product.price),
  originalPrice: product.originalPrice == null ? '' : Number(product.originalPrice),
  rating: Number(product.rating) || 0,
  reviews: Number(product.reviews) || 0,
  inStock: bool(product.inStock),
  featured: bool(product.featured),
});

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load products');
      const items = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(items)) throw new Error('The products API returned an invalid response');
      setProducts(items.map(normalize));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { loadProducts(); }, []);

  const categories = useMemo(() => [...new Set(products.map(item => item.category).filter(Boolean))].sort(), [products]);
  const filtered = useMemo(() => products.filter(item => (
    (category === 'all' || item.category === category) &&
    [item.name, item.nepali, item.category].some(value => value?.toLowerCase().includes(search.toLowerCase()))
  )), [products, category, search]);
  const openCreate = () => { setEditingId(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = product => { setEditingId(product.id); setForm({ ...EMPTY, ...product }); setError(''); setModalOpen(true); };
  const onChange = event => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveProduct = async event => {
    event.preventDefault(); setSaving(true); setError('');
    const payload = {
      ...form, name: String(form.name || '').trim(), category: String(form.category || '').trim().toLowerCase(),
      price: Number(form.price), originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
      nepali: String(form.nepali || '').trim() || null, unit: String(form.unit || '').trim() || null, description: String(form.description || '').trim() || null,
      farm: String(form.farm || '').trim() || null, location: String(form.location || '').trim() || null, image: String(form.image || '').trim() || null,
    };
    try {
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save product');
      setModalOpen(false); await loadProducts();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const deleteProduct = async product => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setError('');
    try {
      const response = await fetch(`${API}/${product.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete product');
      setProducts(current => current.filter(item => item.id !== product.id));
    } catch (err) { setError(err.message); }
  };

  return <AdminLayout>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div><h2 className="text-xl font-bold text-forest-800">Products ({filtered.length})</h2><p className="text-sm text-forest-500">Live inventory from the database</p></div>
      <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2.5"><Plus size={16} /> Add Product</button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..." className="input-field pl-10 text-sm" /></div>
      <select value={category} onChange={event => setCategory(event.target.value)} className="input-field text-sm min-w-[160px]"><option value="all">All Categories</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select>
    </div>
    {error && !modalOpen && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-primary-50 border-b border-primary-100"><th className="text-left py-4 px-5">Product</th><th className="text-left py-4 px-5 hidden sm:table-cell">Category</th><th className="text-left py-4 px-5">Price</th><th className="text-left py-4 px-5 hidden md:table-cell">Rating</th><th className="text-left py-4 px-5">Status</th><th className="text-left py-4 px-5">Actions</th></tr></thead><tbody className="divide-y divide-primary-50">
      {!loading && filtered.map(product => <tr key={product.id} className="hover:bg-primary-50/50"><td className="py-4 px-5"><div className="flex items-center gap-3">{product.image ? <img src={product.image} alt="" className="w-11 h-11 rounded-xl object-cover" /> : <div className="w-11 h-11 rounded-xl bg-primary-100" />}<div><p className="font-semibold text-forest-800">{product.name}</p><p className="text-xs text-forest-500">{product.unit || '—'}</p></div></div></td><td className="py-4 px-5 hidden sm:table-cell capitalize">{product.category}</td><td className="py-4 px-5"><span className="font-bold text-primary-700">रू {product.price.toLocaleString()}</span>{product.originalPrice > product.price && <span className="text-xs text-forest-400 line-through ml-1">रू {product.originalPrice}</span>}</td><td className="py-4 px-5 hidden md:table-cell text-amber-600">⭐ {product.rating} <span className="text-xs text-forest-400">({product.reviews})</span></td><td className="py-4 px-5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span></td><td className="py-4 px-5"><button onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`} className="p-2 text-primary-600"><Edit3 size={15} /></button><button onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`} className="p-2 text-red-500"><Trash2 size={15} /></button></td></tr>)}
    </tbody></table></div>{loading && <p className="p-8 text-center text-forest-500">Loading products…</p>}{!loading && !filtered.length && <p className="p-8 text-center text-forest-500">No products found.</p>}</div>
    {modalOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"><form onSubmit={saveProduct} className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="mb-6 flex justify-between"><h3 className="text-xl font-bold text-forest-800">{editingId ? 'Edit Product' : 'Add Product'}</h3><button type="button" onClick={() => !saving && setModalOpen(false)}><X size={20} /></button></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2">
      {[['name', 'Name', true], ['nepali', 'Nepali name'], ['category', 'Category', true], ['unit', 'Unit'], ['price', 'Price', true, 'number'], ['originalPrice', 'Original price', false, 'number'], ['farm', 'Farm'], ['location', 'Location'], ['image', 'Image URL']].map(([name, label, required, type]) => <label key={name} className="text-sm font-medium text-forest-700">{label}<input name={name} type={type || 'text'} min={type === 'number' ? '0' : undefined} required={required} value={form[name]} onChange={onChange} className="input-field mt-1 py-2" /></label>)}
      <label className="sm:col-span-2 text-sm font-medium text-forest-700">Description<textarea name="description" value={form.description} onChange={onChange} rows="3" className="input-field mt-1 py-2" /></label><label className="flex items-center gap-2 text-sm"><input name="inStock" type="checkbox" checked={form.inStock} onChange={onChange} /> In stock</label><label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" checked={form.featured} onChange={onChange} /> Featured</label>
    </div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => !saving && setModalOpen(false)} className="btn-outline py-2">Cancel</button><button disabled={saving} className="btn-primary py-2">{saving ? 'Saving…' : 'Save Product'}</button></div></form></div>}
  </AdminLayout>;
}
