import { useMediaQuery } from 'react-responsive';

import { FooterLinks } from './FooterLinks';
import { FooterLogos } from './FooterLogo';
import { LaboratoryInformation } from './LaboratoryInfo';

import { FooterResponseProps } from '../../types/footerTypes';
import { PLACEHOLDER_DESCRIPTION } from '../../utils/placeholders';

import styles from './styles.module.scss';

interface FooterProps {
  footer?: FooterResponseProps;
}

export const Footer = ({ footer }: FooterProps) => {
  const isMobile = useMediaQuery({ maxWidth: 940 });

  if (isMobile) {
    return (
      <footer className={styles.container}>
        <div className={styles.content}>
          <LaboratoryInformation footer={footer as FooterResponseProps} />
          <div className={styles.row}>
            <FooterLinks />
            <FooterLogos logos={footer?.logos} />
          </div>
          <span>{footer?.copyrightText || PLACEHOLDER_DESCRIPTION}</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <FooterLogos logos={footer?.logos} />

        <LaboratoryInformation footer={footer as FooterResponseProps} />

        <FooterLinks />
      </div>
    </footer>
  );
};
