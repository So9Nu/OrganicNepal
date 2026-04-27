import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const monthlyData = [
  { month: 'Jan', sales: 4000, customers: 240, revenue: 2400 },
  { month: 'Feb', sales: 3000, customers: 221, revenue: 2210 },
  { month: 'Mar', sales: 2000, customers: 229, revenue: 2290 },
  { month: 'Apr', sales: 2780, customers: 200, revenue: 2000 },
  { month: 'May', sales: 1890, customers: 229, revenue: 2181 },
  { month: 'Jun', sales: 2390, customers: 200, revenue: 2500 },
];

const topProducts = [
  { name: 'Organic Spinach', sales: 2400 },
  { name: 'Basmati Rice', sales: 1398 },
  { name: 'Fresh Tomatoes', sales: 9800 },
  { name: 'Broccoli', sales: 3908 },
];

const categoryData = [
  { name: 'Vegetables', value: 35, color: '#22c55e' },
  { name: 'Fruits', value: 25, color: '#f59e0b' },
  { name: 'Grains', value: 20, color: '#8b5cf6' },
  { name: 'Dairy', value: 20, color: '#3b82f6' },
];

const metrics = [
  { title: 'Total Revenue', value: 'रू 4,73,000', change: '+18.5%', up: true, icon: DollarSign, color: 'text-green-600' },
  { title: 'Total Customers', value: '8,430', change: '+12.3%', up: true, icon: Users, color: 'text-blue-600' },
  { title: 'Total Orders', value: '1,247', change: '+5.7%', up: true, icon: ShoppingBag, color: 'text-orange-600' },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest-900 mb-2">Analytics</h1>
        <p className="text-forest-600">Track your business performance and metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-forest-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-forest-900">{metric.value}</p>
              </div>
              <metric.icon className={`${metric.color}`} size={24} />
            </div>
            <div className="flex items-center gap-1 text-sm">
              {metric.up ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <span className={metric.up ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-forest-800 mb-6">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Orders */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-forest-800 mb-6">Revenue vs Orders</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="sales" fill="#84cc16" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-forest-800 mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-forest-700">{product.name}</p>
                  <p className="text-sm font-bold text-forest-900">{product.sales}</p>
                </div>
                <div className="w-full bg-forest-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full"
                    style={{ width: `${(product.sales / 9800) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-forest-800 mb-6">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-forest-600">{cat.name}</span>
                </div>
                <span className="font-semibold text-forest-800">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
