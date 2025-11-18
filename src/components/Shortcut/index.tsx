import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../../utils/placeholders';

interface ShortcutProps {
  urlImage: any;
  title: string;
  path: string;
  body: string;
  buttonText: string;
}

export const Shortcut = ({ body, buttonText, path, title, urlImage }: ShortcutProps) => {
  const router = useRouter();

  const handleRedirectToShortcut = () => {
    router.push(`/${path}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          className={styles.image__inner}
          objectFit="cover"
          layout="fill"
          src={urlImage || PLACEHOLDER_IMAGE}
          alt={title || PLACEHOLDER_TITLE}
          priority
        />
      </div>
      <div className={styles.content}>
        <h3>{title || PLACEHOLDER_TITLE}</h3>
        <p>{body || PLACEHOLDER_DESCRIPTION}</p>
        <button
          type="button"
          title={buttonText}
          aria-label="Ver descrição"
          onClick={handleRedirectToShortcut}
          name="ctaButton"
        >
          {buttonText || 'Ver mais'}
        </button>
      </div>
    </div>
  );
};
