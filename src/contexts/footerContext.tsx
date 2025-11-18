import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getInfoFooter } from '../services/requests/footerRequest';
import { FooterResponseProps } from '../types/footerTypes';
import { errorNotify } from '../utils/notify';

type FooterContextType = {
  footer: FooterResponseProps | undefined;
  setFooter: Dispatch<SetStateAction<FooterResponseProps | undefined>>;
  loadingFooter: boolean;
};

type FooterProviderProps = {
  children: ReactNode;
};

const FooterContext = createContext({} as FooterContextType);

export function FooterProvider({ children }: FooterProviderProps) {
  const [footer, setFooter] = useState<FooterResponseProps>();
  const loadingFooter = !!footer;

  useEffect(() => {
    async function fetchFooter() {
      try {
        const response = await getInfoFooter();

        setFooter(response);
      } catch (error: any) {
        errorNotify('Erro no servidor');
      }
    }
    fetchFooter();
  }, []);

  return (
    <FooterContext.Provider value={{ footer, setFooter, loadingFooter }}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  const ctx = useContext(FooterContext);

  return ctx;
}
