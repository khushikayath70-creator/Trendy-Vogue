import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated } = useAdmin();
  return isAuthenticated ? children : <Navigate to="/login" />;
}