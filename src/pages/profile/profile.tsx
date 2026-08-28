import { ProfileMenu } from '@/components/profile-menu/profile-menu';
import { Outlet } from 'react-router-dom';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  return (
    <section className={styles.main}>
      <ProfileMenu />
      <Outlet />
    </section>
  );
};
