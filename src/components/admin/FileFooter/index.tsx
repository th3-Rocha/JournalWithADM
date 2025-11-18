import { useState } from 'react';
import { FileUploadIcon } from '../../Icons';
import { TextInput } from '../TextInput';
import { ButtonRemove } from '../ButtonRemove';
import styles from './styles.module.scss';
import Image from 'next/image';

interface FileFooterProps {
  uploadLogo: string;
  altTextDefault: string;
  inputDisabled: boolean;
  fileName: string;
  fileLogo: string;
  labelFile: string;
  fieldAltText: string;
  labelAltText: string;
  labelLinkLogo: string;
  fieldNameLink: string;
  urlLogo: string;
  fieldPosition: string;
  valuePosition: number;
  deletedPosition: string;
  deletedPositionValue: number;
  altTextString?: string;
  urlTextString?: string;
}

export function FileFooter({
  uploadLogo,
  inputDisabled,
  altTextDefault,
  fileName,
  fileLogo,
  labelFile,
  fieldAltText,
  labelAltText,
  fieldNameLink,
  labelLinkLogo,
  urlLogo,
  fieldPosition,
  valuePosition,
  deletedPosition,
  altTextString,
  urlTextString,

}: FileFooterProps) {
  const [file, setFile] = useState<any>();


  const [deletedPositionValue,setDeletedValue] = useState(false);


  const [valueRemoveAltText,setAltValue] = useState(altTextString);
  const [valueRemoveUrl,setUrlValue] = useState(urlTextString);
   const [valueFileNameUrl,setFileNameValue] = useState(fileName);


  const handleActiveDeleted = () => {
    setDeletedValue(true);
    setAltValue("");
    setUrlValue("");    
    setFileNameValue("")
  };

  const handleValueClick = () => {
    setAltValue(altTextString);
    setUrlValue(urlTextString);
  };


  const handleDesactiveDeleted = () => {
    setDeletedValue(false);
    handleValueClick();
    
  };


  function setFiles(e: any) {
    e.target.files instanceof FileList && setFile(e.target.files[0]);
    
    handleDesactiveDeleted();
  }

  

  return (
    <div className={styles.logosRow}>
      <div className={styles.fileUpload}>
        <span>{uploadLogo}</span>
        <div hidden ={!inputDisabled}>
          <label htmlFor={labelFile} className={styles.classLabel} >
            <div className={styles.upIconDiv} hidden ={!inputDisabled}>
              <div>
                <FileUploadIcon/>
              </div>
            </div>
            <input 
              accept="image/*"
              type="file"
              id={labelFile}
              name={labelFile}
              disabled={!inputDisabled}
              hidden
              onChange={setFiles}/>
          </label>
        </div>
       <div>
        <div>
          <img className={styles.divImage} hidden={!deletedPositionValue || inputDisabled}
              src= {"https://upload.wikimedia.org/wikipedia/commons/c/cc/Cross_red_circle.svg"} 
            />
          </div>
          <img className={styles.divImage} hidden={inputDisabled || deletedPositionValue }
              src= {fileLogo || "https://upload.wikimedia.org/wikipedia/commons/c/cc/Cross_red_circle.svg"} 
            />
       </div>
        
        <div className={styles.fileName}>{file?.name || valueFileNameUrl || ''}</div> 
      </div>
           

      <div className={styles.altTextLogo}>
        <TextInput
          label={labelAltText}
          name={fieldAltText}
          defaultValue={altTextDefault}
          disabled={!inputDisabled}
          value={valueRemoveAltText}
          onClick={handleDesactiveDeleted}
        />
      </div>

      <div className={styles.altTextLogo}>
        <TextInput
          label={labelLinkLogo}
          name={fieldNameLink}
          defaultValue={urlLogo}
          disabled={!inputDisabled}
          value={valueRemoveUrl}
          onClick={handleDesactiveDeleted}
        />
      </div>







      <div className={styles.removeLogoButton}>
        <ButtonRemove
          type="submit"
          handleClick={handleActiveDeleted}

          name={deletedPosition + "button"}
          id= {deletedPosition + "button"}
          disabled={!inputDisabled}
        />
      </div>




      <input
        type="hidden"
        name={deletedPosition}
        id={deletedPosition}
        value= {Number(deletedPositionValue)}

      />

      <input
        type="hidden"
        name={fieldPosition}
        id={fieldPosition}
        value= {valuePosition}
      />

    </div>
  );
}
