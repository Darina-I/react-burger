import { useAppDispatch } from '@/hooks/useAppHooks';
import { FeedOrderDetailsModal } from '@/pages/feed-order-details-modal/feed-order-details-modal';
import { FeedPage } from '@/pages/feed/feed';
import { ForgotPasswordPage } from '@/pages/forgot-password/forgot-password';
import { IngredientDetails } from '@/pages/ingredient-details/ingredient-details';
import { LoginPage } from '@/pages/login/login';
import { ProfilePage } from '@/pages/profile/profile';
import { RegisterPage } from '@/pages/register/register';
import { ResetPasswordPage } from '@/pages/reset-password/reset-password';
import { checkAuthStatus } from '@/services/user/userSlice';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@pages/home/home';

import { FeedOrderDetails } from '../../pages/feed-order-details/feed-order-details';
import { IngredientDetailsModal } from '../../pages/ingredient-details-modal/ingredient-details-modal';
import { ListOrdersUser } from '../list-orders-user/list-orders-user';
import { ProfileForm } from '../profile-form/profile-form';
import { ProtectedRoute } from '../protected-route/protected-route';

import styles from './app.module.css';

type AppLocationState = {
  from?: { pathname: string; search?: string; hash?: string };
  backgroundLocation?: { pathname: string; search?: string; hash?: string };
};

export const App = (): React.JSX.Element => {
  const location = useLocation() as { state: AppLocationState | undefined };
  const backgroundLocation = location.state?.backgroundLocation;
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes location={backgroundLocation ?? location}>
          <Route
            path="/login"
            element={
              <ProtectedRoute anonymous>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute anonymous>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute anonymous>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute anonymous>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileForm />} />
            <Route path="orders" element={<ListOrdersUser />} />
          </Route>
          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <FeedOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
          <Route path="/ingredients/:id" element={<IngredientDetails />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:id" element={<FeedOrderDetails />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/ingredients/:id" element={<IngredientDetailsModal />} />
            <Route path="/feed/:id" element={<FeedOrderDetailsModal />} />
            <Route
              path="/profile/orders/:id"
              element={
                <ProtectedRoute>
                  <FeedOrderDetailsModal />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;
