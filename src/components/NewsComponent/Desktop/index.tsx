import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import styles from './styles.module.scss';
import { replaceSpaceWithUnderscore } from '../../../utils/replaceSpaceWithUnderscore';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION, PLACEHOLDER_ALT, PLACEHOLDER_DATE_LABEL } from '../../../utils/placeholders';

type NewsProps = {
  url: string | undefined | null;
  title: string | undefined | null;
  description: string | undefined | null;
  date: Date | string | undefined | null;
  id: string | undefined | null;
  alt: string | undefined | null;
  showImage: Boolean;
  showDate: Boolean;
};

export const DesktopNewsComponent = ({
  date,
  description,
  title,
  url,
  id,
  showImage,
  showDate,
  alt,
}: NewsProps) => {

  const div = typeof document !== 'undefined' ? document.createElement('div') : { innerHTML: '' } as any;
  if (description) div.innerHTML = description;
  const rawText = (div as any).textContent || (div as any).innerText || '';
  const safeText = rawText.trim() ? rawText : PLACEHOLDER_DESCRIPTION;

  const imageSrc = url || PLACEHOLDER_IMAGE;
  const safeAlt = alt || PLACEHOLDER_ALT;
  const safeTitle = title || PLACEHOLDER_TITLE;
  const safeId = id || '';
  const formattedDate = showDate && date ? format(new Date(date), 'dd, MMM yyyy', { locale: pt }) : (showDate ? PLACEHOLDER_DATE_LABEL : '');
  
  return (
    <Link suppressHydrationWarning={true} href={`/noticias/${safeId}?slug=${replaceSpaceWithUnderscore(safeTitle)}`}>

      <a className={styles.container}>
        {showImage && (
          <div className={styles.image}>
            <Image src={imageSrc} alt={safeAlt} layout="fill" objectFit="cover" />
          </div>
        )}
        <div className={styles.info}>
          {showDate && <span>{formattedDate}</span>}
          <h3>{safeTitle}</h3>
          <p>{safeText}</p>
        </div>
      </a>

    </Link>
  );
};
