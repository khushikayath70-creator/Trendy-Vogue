import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/login';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCloths from './pages/admin/ManageCloths';
import ManageFootWear from './pages/admin/ManageFootWear';
import ManageSale from './pages/admin/ManageSale';

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/cloths" element={<ManageCloths />} />
            <Route path="/footWear" element={<ManageFootWear />} />
            <Route path="/sale" element={<ManageSale />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;