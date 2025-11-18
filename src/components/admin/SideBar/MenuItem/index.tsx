import Link from 'next/link';

import styles from './styles.module.scss';

interface MenuItemProps {
  children: any;
  route: string;
}

export const MenuItem = ({ children, route }: MenuItemProps) => {
  return (
    <Link href={route}>
      <a className={styles.link} href="#">
        {children}
      </a>
    </Link>
  );
};
