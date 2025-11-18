import Link from 'next/link';
import Image from 'next/image';

import styles from './styles.module.scss';
import { PLACEHOLDER_IMAGE, PLACEHOLDER_ALT } from '../../../utils/placeholders';
interface LogoData {
  _id: string;
  altText: string;
  urlLogo: string;
  file: {
    _id: string;
    platform: string;
    imageName: string;
    size: number;
    key: string;
    url: string;
    altText: string;
    createdAt: string;
    updateAt: string;
  };
}

interface FooterLogosProps {
  logos: LogoData[];
}

export const FooterLogos = ({ logos }: FooterLogosProps) => {
  const safeLogos: LogoData[] = (logos && logos.length
    ? logos
    : ([{
        _id: 'placeholder-logo',
        altText: PLACEHOLDER_ALT,
        urlLogo: '#',
        file: {
          _id: 'placeholder-file',
          platform: 'web',
          imageName: 'placeholder.png',
          size: 0,
          key: 'placeholder',
          url: PLACEHOLDER_IMAGE,
          altText: PLACEHOLDER_ALT,
          createdAt: '',
          updateAt: '',
        },
      }] as unknown as LogoData[]));

  return (
    <nav className={styles.container}>
      {safeLogos.map((logo) => (
        <Link href={logo?.urlLogo || '#'} key={logo?._id}>
          <a target="_blank">
            <Image
              width={150}
              height={46}
              src={logo?.file?.url || PLACEHOLDER_IMAGE}
              objectFit="contain"
              quality={100}
              alt={logo?.altText || PLACEHOLDER_ALT}
            />
          </a>
        </Link>
      ))}
    </nav>
  );
};
