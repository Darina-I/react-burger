import { useAppDispatch } from '@/hooks/useAppHooks';
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

import { IngredientDetailsModal } from '../../pages/ingredient-details-modal/ingredient-details-modal';
import { GuestRoute } from '../guest-route/guest-route';
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
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
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
            <Route
              path="orders"
              element={
                <div className="text text_type_main-default text_color_inactive">
                  Страница находится в разработке
                </div>
              }
            />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients/:id" element={<IngredientDetails />} />
          <Route
            path="/feed"
            element={
              <div className="text text_type_main-default text_color_inactive">
                Страница находится в разработке
              </div>
            }
          />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/ingredients/:id" element={<IngredientDetailsModal />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;
