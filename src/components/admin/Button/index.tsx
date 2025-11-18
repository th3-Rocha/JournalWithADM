import { HTMLProps } from 'react';

import styles from './styles.module.scss';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  label: string;
  left?: boolean;
  operation?: boolean;
  handleClick: () => void;
}

export function Button({ label ,left, operation, handleClick }: ButtonProps) {
  return (
    <button
      type={operation ? 'submit' : 'button'}
      className={`${styles.button} ${left ? styles.left : ''}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
