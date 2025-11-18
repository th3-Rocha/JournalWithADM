import Link from 'next/link';

import styles from './styles.module.scss';

export const FooterLinks = () => {
  return (
    <nav className={styles.container}>
      <h3>Acesso Rápido</h3>
      <ul>
        <li>
          <Link href="/noticias">
            <a>Notícias</a>
          </Link>
        </li>
        <li>
          <Link href="/sobre">
            <a>Sobre</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
