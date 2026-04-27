import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { orders, revenueData, categoryRevenue, products } from '../../data/mockData';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statCards = [
  { title: 'Total Revenue', value: 'रू 4,73,000', change: '+18.5%', up: true, icon: TrendingUp, color: 'bg-primary-50 text-primary-700' },
  { title: 'Total Orders', value: '1,247', change: '+12.3%', up: true, icon: ShoppingBag, color: 'bg-orange-50 text-orange-700' },
  { title: 'Active Customers', value: '8,430', change: '+5.7%', up: true, icon: Users, color: 'bg-blue-50 text-blue-700' },
  { title: 'Products Listed', value: '500+', change: '-2.1%', up: false, icon: Package, color: 'bg-emerald-50 text-emerald-700' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={22} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                card.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-forest-800">{card.value}</p>
            <p className="text-sm text-forest-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-forest-800">Revenue Overview</h2>
            <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-3 py-1 rounded-full">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`रू ${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#revGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-forest-800 mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {categoryRevenue.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryRevenue.map(c => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-forest-700">{c.name}</span>
                </div>
                <span className="font-semibold text-forest-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-forest-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-primary-600 hover:underline font-medium">View all →</a>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-primary-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-forest-800">{order.id}</p>
                  <p className="text-xs text-forest-500">{order.customer} · {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-forest-800">रू {order.total.toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-forest-800">Inventory Alerts</h2>
            <a href="/admin/products" className="text-xs text-primary-600 hover:underline font-medium">Manage →</a>
          </div>
          <div className="space-y-3">
            {products.filter(p => !p.inStock).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-forest-800 truncate">{p.name}</p>
                  <p className="text-xs text-forest-500">{p.category}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-full flex-shrink-0">Out of Stock</span>
              </div>
            ))}
            {products.filter(p => p.inStock).slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-forest-800 truncate">{p.name}</p>
                  <p className="text-xs text-forest-500">{p.category}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full flex-shrink-0">Low Stock</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
