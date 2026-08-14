import { NavLink, useMatch } from 'react-router-dom';

import styles from './app-link.module.css';

type LinkProps = {
  to: string;
  children: React.ReactNode;
  activeIcon?: React.ReactNode;
  inactiveIcon?: React.ReactNode;
};

export const AppLink = ({
  to,
  children,
  activeIcon,
  inactiveIcon,
}: LinkProps): React.JSX.Element => {
  const hasIcon = !!activeIcon;
  const match = useMatch(to);
  const isActive = !!match;

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.activeLink : 'text_color_inactive'}`
      }
    >
      {hasIcon && <>{isActive ? activeIcon : inactiveIcon}</>}
      {children}
    </NavLink>
  );
};
