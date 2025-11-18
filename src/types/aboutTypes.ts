import { FileProps } from './fileTypes';

export type AboutResponseProps = {
  _id: string;
  title: string;
  text: string;
  file: FileProps;
};
