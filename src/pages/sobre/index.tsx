import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { FooterResponseProps } from '../../types/footerTypes';
import { getInfoFooter } from '../../services/requests/footerRequest';
import { getAboutInfo } from '../../services/requests/aboutRequest';
import { AboutResponseProps } from '../../types/aboutTypes';

import styles from './styles.module.scss';

type AboutProps = {
  dataFooter: FooterResponseProps;
  dataAbout: AboutResponseProps;
};

export default function About({ dataFooter, dataAbout }: AboutProps) {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h3>Sobre a LAPER²ME</h3>
          <div className={styles.imageContainer}>
            <Image
              src={dataAbout?.file?.url}
              objectFit="cover"
              layout="fill"
              alt="LAPER²ME"
            />
          </div>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: dataAbout?.text }}
          />
        </div>
      </div>
      <Footer footer={dataFooter} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const responseFooterInfo = await getInfoFooter();
  const responseAboutInfo = await getAboutInfo();

  return {
    props: {
      dataFooter: responseFooterInfo || null,
      dataAbout: responseAboutInfo || null,
    }
  };
};
