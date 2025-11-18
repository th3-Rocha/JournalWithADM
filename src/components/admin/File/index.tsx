import React, { Dispatch, SetStateAction } from 'react';

import styles from './styles.module.scss';

type FileProps = {
  platform: string | undefined;
  imageName?: string | undefined;
  fileName: string | undefined;
  setFile: Dispatch<SetStateAction<any | undefined>>;
};

export const FileContent = ({
  imageName,
  platform,
  fileName,
  setFile,
}: FileProps) => {
  return (
    <div className={styles.container}>
      <label htmlFor={platform}>
        Selecionar arquivo
        <input
          accept="image/*"
          type="file"
          id={platform}
          hidden
          onChange={(e) =>
            e.target.files instanceof FileList && setFile(e.target.files[0])
          }
        />
      </label>
      <div>{imageName || fileName || 'Nenhum arquivo selecionado'}</div>
    </div>
  );
};
