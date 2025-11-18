import {
  IconEmail,
  IconLocation,
  IconPhone,
  IconSchool,
  ScienceIcon,
} from '../../Icons';
import { FooterResponseProps } from '../../../types/footerTypes';
import { PLACEHOLDER_TITLE, PLACEHOLDER_DESCRIPTION } from '../../../utils/placeholders';

import styles from './styles.module.scss';

type FooterProps = {
  footer?: FooterResponseProps;
};

function getCurrentYear() {
  try {
    const currentYear = new Date().getFullYear();
    return currentYear;
  } catch (error) {
    throw new Error('Failed to get current year');
  }
}

export const LaboratoryInformation = ({ footer }: FooterProps) => {
  const institution = footer?.institution || PLACEHOLDER_TITLE;
  const location = footer?.location || PLACEHOLDER_TITLE;
  const phone = footer?.phone || PLACEHOLDER_DESCRIPTION;
  const email = footer?.email || PLACEHOLDER_DESCRIPTION;
  const laboratoryName = footer?.laboratoryName || PLACEHOLDER_TITLE;
  const copyrightText = footer?.copyrightText || PLACEHOLDER_DESCRIPTION;
  return (
    <div className={styles.labContainer}>
      <div className={styles.text}>
        <IconSchool />
        <span>{institution}</span>
      </div>
      <div className={styles.text}>
        <IconLocation />
        <span>{location}</span>
      </div>
      <div className={styles.text}>
        <IconPhone />
        <span>Telefone: {phone}</span>
      </div>
      <div className={styles.text}>
        <IconEmail />
        <span>Email: {email}</span>
      </div>
      <div className={styles.text}>
        <ScienceIcon />
        <span>{laboratoryName}</span>
      </div>
      <div className={styles.text}>
        <span>{getCurrentYear() + " © " + copyrightText  }</span>
      </div>
    </div>
  );
};
