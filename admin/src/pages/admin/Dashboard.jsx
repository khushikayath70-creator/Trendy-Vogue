// admin/src/pages/admin/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminDashboard() {
  const { products, cloths, footWear, saleItems, loading, fetchAllData } = useAdmin();

  // Guard while data is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Products', count: products?.length || 0, link: '/products', icon: '👗', bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'cloths', count: cloths?.length || 0, link: '/cloths', icon: '📁', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'footWear', count: footWear?.length || 0, link: '/footWear', icon: '👟', bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Sale Items', count: saleItems?.length || 0, link: '/sale', icon: '🏷️', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section with Refresh Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm uppercase tracking-wider">Welcome back, Admin</p>
        </div>
        <button
          onClick={fetchAllData}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(stat => (
          <Link
            key={stat.label}
            to={stat.link}
            className={`group ${stat.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stat.icon}</span>
              <span className="text-2xl font-semibold font-serif">{stat.count}</span>
            </div>
            <p className={`text-sm font-medium uppercase tracking-wider ${stat.text}`}>{stat.label}</p>
            <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Manage {stat.label.toLowerCase()} →
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl font-light text-gray-900 mb-5 pb-2 border-b border-gray-100">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              <span>➕</span> Add Product
            </Link>
            <Link
              to="/cloths"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              <span>📁</span> Add Collection
            </Link>
            <Link
              to="/footWear"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              <span>👟</span> Add Designer
            </Link>
            <Link
              to="/sale"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              <span>🏷️</span> Add Sale Item
            </Link>
          </div>
        </div>

        {/* Recent Activity (dynamic from context) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl font-light text-gray-900 mb-5 pb-2 border-b border-gray-100">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p>Last login: {new Date(localStorage.getItem('lastLogin') || Date.now()).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p>Total items in store: {stats.reduce((acc, s) => acc + s.count, 0)}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <p>Active sale items: {saleItems?.length || 0}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Data synchronized with backend API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}