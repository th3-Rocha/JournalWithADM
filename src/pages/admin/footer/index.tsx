import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import React, { useEffect } from "react";
import { parseCookie } from '../../../utils/cookies';
import { SideBar } from '../../../components/admin/SideBar';
import { TextInput } from '../../../components/admin/TextInput';
import { Button } from '../../../components/admin/Button';
import { getAPIClient } from '../../../services/axios';
import { FooterResponseProps } from '../../../types/footerTypes';
import { QuestionModal } from '../../../components/admin/Modal/QuestionModal';
import { updateInfoFooter } from '../../../services/requests/footerRequest';
import { ReactNotificationModal } from '../../../components/admin/Modal/ResponseModal';
import { FileFooter } from '../../../components/admin/FileFooter';

import styles from './styles.module.scss';

type FooterPagePros = {
  data: FooterResponseProps;
  fallback: boolean;
};

const fieldsLogo = [
  {
    uploadLogo: 'Upload da logo 1',
    fileName: 'file1',
    labelAltText: 'Texto Alt da logo 1',
    fieldAltText: 'altTextLogo1',
    labelLinkLogo: 'Link da logo 1',
    fieldNameLink: 'urlLogo1',
    fieldPosition: 'position1',
    deletedPosition: 'deleted1',
    deletedPositionValue: 0,
  },
  {
    uploadLogo: 'Upload da logo 2',
    fileName: 'file2',
    labelAltText: 'Texto Alt da logo 2',
    fieldAltText: 'altTextLogo2',
    labelLinkLogo: 'Link da logo 2',
    fieldNameLink: 'urlLogo2',
    fieldPosition: 'position2',
    deletedPosition: 'deleted2',
    deletedPositionValue: 0,
  },
  {
    uploadLogo: 'Upload da logo 3',
    fileName: 'file3',
    labelAltText: 'Texto Alt da logo 3',
    fieldAltText: 'altTextLogo3',
    labelLinkLogo: 'Link da logo 3',
    fieldNameLink: 'urlLogo3',
    fieldPosition: 'position3',
    deletedPosition: 'deleted3',
    deletedPositionValue: 0,
  },
  {
    uploadLogo: 'Upload da logo 4',
    fileName: 'file4',
    labelAltText: 'Texto Alt da logo 4',
    fieldAltText: 'altTextLogo4',
    labelLinkLogo: 'Link da logo 4',
    fieldNameLink: 'urlLogo4',
    fieldPosition: 'position4',
    deletedPosition: 'deleted4',
    deletedPositionValue: 0,
  },
  {
    uploadLogo: 'Upload da logo 5',
    fileName: 'file5',
    labelAltText: 'Texto Alt da logo 5',
    fieldAltText: 'altTextLogo5',
    labelLinkLogo: 'Link da logo 5',
    fieldNameLink: 'urlLogo5',
    fieldPosition: 'position5',
    deletedPosition: 'deleted5',
    deletedPositionValue: 0,
  },
];

export default function FooterPage({ data }: FooterPagePros) {
  const formRef = useRef<any>();
  const router = useRouter();
  
  const [inputDisabled, setInputDisabled] = useState(false);

  const [modalError, setModalError] = useState({ state: false, error: '' });
  const [modalSuccess, setModalSuccess] = useState(false);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleOpenQuestionModal = () =>
    setOpenQuestionModal(!openQuestionModal);
  const handleOpenCancelModal = () => setOpenCancelModal(!openCancelModal);

   

  const handleEnableEditing = () => {
    setInputDisabled(!inputDisabled);
    setOpenCancelModal(false);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    const formData = new FormData(formRef.current);
    const response = await updateInfoFooter(formData);
    
    if (response.error) {
      setModalError({ state: true, error: response.error });

      if(response.IsTokenError){
        router.push('/admin/login');
      }
      else{
        

      }
      
      return;
    }
    setModalSuccess(true);
    setInputDisabled(false);
  }

  return (
    <>
      <Head>
        <title>Footer | Admin</title>
      </Head>

      {modalError.state && (
        <ReactNotificationModal
          isOpen={modalError.state}
          title="Erro"
          body={String(modalError.error)}
          onClick={() => undefined}
          handleSetModal={setModalError}
        />
      )}
      {modalSuccess && (
        <ReactNotificationModal
          isOpen={modalSuccess}
          title="Informações do footer atualizadas!"
          body="Clique em OK para continuar."
          onClick={() => router.reload()}
          handleSetModal={setModalSuccess}
        />
      )}

      <div className={styles.container}>
        <SideBar />
        <main>
          <form ref={formRef}>
            <h2 id="title">Informações do Footer</h2>
            <div className={styles.row}>
              <input
                type="hidden"
                name="bucketName"
                id="bucketName"
                value={process.env.S3_BUCKET_NAME}
              />
              <input
                type="hidden"
                name="bucketFolder"
                id="bucketFolder"
                value="footer"
              />
              <TextInput
                label="Instituição"
                name="institution"
                defaultValue={data?.institution}
                disabled={!inputDisabled}
              />
              <TextInput
                label="Localização"
                name="location"
                defaultValue={data?.location}
                disabled={!inputDisabled}
              />
            </div>
            <div className={styles.row}>
              <TextInput
                label="Email"
                name="email"
                defaultValue={data?.email}
                disabled={!inputDisabled}
              />
              <TextInput
                label="Telefone"
                name="phone"
                defaultValue={data?.phone}
                disabled={!inputDisabled}
              />
            </div>
            <div className={styles.row}>
              <TextInput
                label="Laboratório"
                maxLength={100}
                name="laboratoryName"
                defaultValue={data?.laboratoryName}
                disabled={!inputDisabled}
              />
              <TextInput
                label="Copyright"
                name="copyrightText"
                defaultValue={ data?.copyrightText}
                
                disabled={!inputDisabled}
              />
            </div>
            <div className={styles.logosContainer}>
              <h2>Logos Institucionais</h2>
              <div className={styles.fieldsLogo}>
                {fieldsLogo.map((value, index) => (
                  <FileFooter
                    key={value?.uploadLogo}
                    inputDisabled={inputDisabled}
                    uploadLogo={value.uploadLogo}
                    labelFile={value.fileName}
                    fileName={data.logos[index]?.file.imageName}
                    fileLogo={data.logos[index]?.file.url}
                    altTextDefault={data.logos[index]?.altText}
                    labelAltText={value.labelAltText}
                    fieldAltText={value.fieldAltText}
                    labelLinkLogo={value.labelLinkLogo}
                    fieldNameLink={value.fieldNameLink}
                    urlLogo={data.logos[index]?.urlLogo}
                    fieldPosition={value.fieldPosition}
                    valuePosition={index}
                    deletedPosition={value.deletedPosition}
                    deletedPositionValue={value.deletedPositionValue}
                    
                  />

                  
                ))}
              </div>
            </div>
            <div className={styles.contentButton}>
              {!inputDisabled ? (
                <Button
                  label="Editar"
                  name="laboratoryName"
                  handleClick={handleEnableEditing}
                />
              ) : (
                <>
                  <Button
                    label="Cancelar"
                    left
                    handleClick={handleOpenCancelModal}
                  />
                  <QuestionModal
                    open={openCancelModal}
                    title="Cancelar Edição"
                    body="Você realmente quer cancelar?"
                    btnLeft="Não"
                    btnRight="Sim"
                    handleCancelModal={handleOpenCancelModal}
                    handleClosedComponent={handleEnableEditing}
                  />
                  <Button
                    label="Atualizar"
                    type="submit"
                    id="confirm"
                    handleClick={handleOpenQuestionModal}
                  />
                  <QuestionModal
                    open={openQuestionModal}
                    submit
                    title="Atualizar Footer"
                    body="Você realmente quer atualizar as informações do Footer?"
                    btnLeft="Voltar"
                    btnRight="Confirmar"
                    handleCancelModal={handleOpenQuestionModal}
                    handleSubmit={handleSubmit}
                  />
                </>
              )}
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  
  try {
    
    const { 'nextauth.token': token } = parseCookie(ctx.req);
    const apiClient = getAPIClient(ctx);
    
    const response = await apiClient.get<FooterResponseProps>(
      `/footer/get`
    );
      
    if (!token) {
      
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    return {
      props: { data: response.data, fallback: true },
    };
  } catch (error: any) {
    
    return { 
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};



