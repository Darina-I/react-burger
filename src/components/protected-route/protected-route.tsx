import { useAppSelector } from '@/hooks/useAppHooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

type LocationState = {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
};

export const ProtectedRoute = ({
  children,
  anonymous = false,
}: {
  children: React.ReactNode;
  anonymous?: boolean;
}): React.ReactNode => {
  const user = useAppSelector((state) => state.user.user);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const location = useLocation() as { state: LocationState | undefined };

  if (isLoading) {
    return <Preloader />;
  }

  if (!user && !anonymous) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && anonymous) {
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;
  }

  return children;
};
