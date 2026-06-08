import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">טוען...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
