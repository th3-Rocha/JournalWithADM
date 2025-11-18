import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

interface NavLinkProps {
  path: string;
  menuItem: string;
}

export const NavLink = ({ path, menuItem }: NavLinkProps) => {
  const { asPath } = useRouter();

  return (
    <Link href={`/${path}`}>
      <a
        className={`${styles.link} ${
          asPath === `/${path}` ? styles.active : ''
        }`}
      >
        {menuItem}
      </a>
    </Link>
  );
};
