import { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Filter } from 'lucide-react';
import { products } from '../../data/mockData';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-forest-800">Products ({filtered.length})</h2>
        <button className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field text-sm min-w-[160px]"
        >
          <option value="all">All Categories</option>
          {['vegetables', 'fruits', 'dairy', 'grains', 'spices'].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-100">
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Product</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700 hidden sm:table-cell">Category</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Price</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700 hidden md:table-cell">Rating</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Status</th>
                <th className="text-left py-4 px-5 font-semibold text-forest-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-forest-800">{product.name}</p>
                        <p className="text-xs text-forest-500">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 hidden sm:table-cell">
                    <span className="capitalize text-forest-600">{product.category}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <span className="font-bold text-primary-700">रू {product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-forest-400 line-through ml-1">रू {product.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className="text-amber-600 font-semibold">⭐ {product.rating}</span>
                    <span className="text-xs text-forest-400 ml-1">({product.reviews})</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary-100 rounded-lg text-primary-600 transition-colors">
                        <Edit3 size={15} />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
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
