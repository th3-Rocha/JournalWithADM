import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';

// export type ReactHookFormProps = {
//   name: string;
// } & Partial<Pick<UseFormReturn, 'register'>>;

export type ReactHookFormProps = {
  label: string;
  name: string;
  type?: string;
  children?: ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & Partial<Pick<UseFormReturn, 'register' | 'setValue'>>;
