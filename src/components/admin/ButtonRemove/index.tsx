import { HTMLProps } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.module.scss';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface ButtonRemoveProps extends HTMLProps<HTMLButtonElement> {
  left?: boolean;
  operation?: boolean;
  handleClick: () => void;
  disabled?: boolean;
}

export function ButtonRemove({ left, operation, handleClick, disabled }: ButtonRemoveProps) {
  return (
    <button
      type={operation ? 'submit' : 'button'}
      className={`${styles.button} ${left ? styles.left : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      
      <FontAwesomeIcon icon={faTrash} size="xl" />
    </button>
    
  );
}
