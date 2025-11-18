import { HTMLProps, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface TooltipProps extends HTMLProps<HTMLButtonElement> {
  tooltip?: string; 
}

export function Tooltip({ tooltip, ...rest }: TooltipProps) {

  const [show, setShow] = useState(false);

  return (
    <div className={styles.tooltip}>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          size="lg"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        />
    <span className={styles.tooltiptext}>{tooltip}</span>      
  </div>

  );

}