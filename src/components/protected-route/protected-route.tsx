import { useAppSelector } from '@/hooks/useAppHooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const user = useAppSelector((state) => state.user.user);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
