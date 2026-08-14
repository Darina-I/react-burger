import { useAppSelector } from '@/hooks/useAppHooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import type * as React from 'react';

type GuestRouteProps = {
  children: React.ReactNode;
};

type GuestLocationState = {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
};

export const GuestRoute = ({ children }: GuestRouteProps): React.ReactNode => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const location = useLocation() as { state: GuestLocationState | undefined };

  if (isLoading) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;
  }

  return children;
};
