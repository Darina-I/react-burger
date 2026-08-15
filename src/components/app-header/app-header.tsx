import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { AppLink } from '../app-link/app-link';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4 text text_type_main-default`}>
        <div className={styles.menu_part_left}>
          <AppLink
            to="/"
            activeIcon={<BurgerIcon type="primary" />}
            inactiveIcon={<BurgerIcon type="secondary" />}
          >
            Конструктор
          </AppLink>
          <AppLink
            to="/feed"
            activeIcon={<ListIcon type="primary" />}
            inactiveIcon={<ListIcon type="secondary" />}
          >
            Лента заказов
          </AppLink>
        </div>
        <div className={styles.logo} onClick={() => void navigate('/')}>
          <Logo />
        </div>
        <div className={styles.link_position_last}>
          <AppLink
            to="/profile"
            activeIcon={<ProfileIcon type="primary" />}
            inactiveIcon={<ProfileIcon type="secondary" />}
          >
            Личный кабинет
          </AppLink>
        </div>
      </nav>
    </header>
  );
};
