import { useLogoutMutation } from '@/services/user/authApi';
import { clearUser } from '@/services/user/userSlice';
import { useDispatch } from 'react-redux';

import { AppLink } from '../app-link/app-link';

import type React from 'react';

import styles from './profile-menu.module.css';

export const ProfileMenu = (): React.JSX.Element => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      await logout({ token: refreshToken }).unwrap();
      dispatch(clearUser());
    }
  };

  return (
    <section className={styles.menu}>
      <nav className={`${styles.nav} text text_type_main-medium mt-5`}>
        <AppLink to="/profile">Профиль</AppLink>
        <AppLink to="/profile/orders">История заказов</AppLink>
        <a className={styles.logout} onClick={() => void handleLogout()}>
          Выход
        </a>
      </nav>
      <p className="text text_type_main-default text_color_inactive mt-20">
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </section>
  );
};
