import Link from 'next/link';

import styles from './styles.module.scss';

interface NextLinkProps {
  url: string;
}

export function NextLink({ url }: NextLinkProps) {
  return (
    <Link href={{ pathname: url }}>
      <a className={styles.nextLink} href="#">
        Voltar
      </a>
    </Link>
  );
}
