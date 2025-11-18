import { FileProps } from './fileTypes';

export type CTAProps = {
  data: Array<CTAResponse>;
  fallback: boolean;
};

export type CTAResponse = {
  _id: string;
  title: string;
  path: string;
  text: string;
  buttonText: string;
  file: FileProps;
};
