
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailConfirmation?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailConfirmation = false 
}) => {
  const { user, loading, isEmailConfirmed } = useAuthSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireEmailConfirmation && !isEmailConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Vérification requise</h2>
          <p>Veuillez vérifier votre adresse e-mail pour accéder à cette fonctionnalité.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
