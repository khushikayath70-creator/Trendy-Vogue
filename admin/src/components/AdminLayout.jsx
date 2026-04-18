import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminLayout() {
  const { logout } = useAdmin();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📁' },
    { path: '/cloths', label: 'Cloths', icon: '👗' },
    { path: '/footWear', label: 'Foot Wear', icon: '👟' },
    { path: '/sale', label: 'Sale Items', icon: '🏷️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="font-serif text-2xl font-light tracking-wide">Vogue<span className="text-amber-400">Admin</span></h1>
          <p className="text-xs text-gray-400 mt-1">Content Management System</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-amber-500/20 text-amber-300 border-l-4 border-amber-500'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">
              {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}