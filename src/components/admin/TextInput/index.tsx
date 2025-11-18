import { InputHTMLAttributes } from 'react';
import { ReactHookFormProps } from '../../../types/reactHookForm';
import { Tooltip } from '../Tooltip';
import styles from './styles.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & ReactHookFormProps & {
  tooltipText?: string;
};

export const TextInput = ({
  name,
  label,
  register,
  tooltipText, // Adicione isso para desestruturar tooltipText
  ...props
}: TextInputProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.tooltipLabel}>
        <span>{label}</span>
        {tooltipText && (
        <Tooltip 
            label="Título"
            tooltip={tooltipText} 
          />
        )}
      </div>
      <input
        name={name}
        {...(register && register(name))}
        required
        maxLength={50}
        autoComplete="true"
        {...props}
      />
    </div>
  );
};
