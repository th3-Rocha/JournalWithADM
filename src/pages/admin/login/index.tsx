import Image from 'next/image';
import Head from 'next/head';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useForm } from 'react-hook-form';
import IconLock from '@mui/icons-material/LockOutlined';
import IconEmail from '@mui/icons-material/EmailOutlined';
import Alert from '@material-ui/lab/Alert';

import { useAuthenticated } from '../../../contexts/AuthContext';
import { errorNotify } from '../../../utils/notify';
import logoImg from '../../../../public/azul_laranja_completo.svg';

import styles from './styles.module.scss';

interface interfaceLogin {
  email: string;
  password: string;
}

const formValidation = yup.object().shape({
  email: yup
    .string()
    .email('Informe um e-mail válido')
    .required('Campo obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve conter no mínimo 6 caracteres')
    .max(32, 'A senha não deve ultrapassar 32 caracteres')
    .required('Campo obrigatório'),
});

export default function Login() {
  const { signIn } = useAuthenticated();
  const formOptions = { resolver: yupResolver(formValidation) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { isSubmitting, errors } = formState;

  async function handleSignIn(data: interfaceLogin) {
    try {
      await signIn(data);
    } catch (error) {
      errorNotify('Erro no servidor');
    }
  }

  return (
    <>
      <Head>
        <title>Admin | Login</title>
      </Head>

      <form className={styles.form} onSubmit={handleSubmit(handleSignIn)}>
        <Image src={logoImg} width={350} height={150} alt="Logo" />

        <div className={styles.row}>
          <label htmlFor="email">E-mail</label>
          <div className={styles.input}>
            <input type="email" id="email" {...register('email')} />
            <IconEmail />
          </div>
          {errors.email && (
            <Alert style={{ width: '100%' }} severity="error">
              {errors.email.message}
            </Alert>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Senha</label>
          <div className={styles.input}>
            <input type="password" id="password" {...register('password')} />
            <IconLock />
          </div>
          {errors.password && (
            <Alert style={{ width: '100%' }} severity="error">
              {errors.password.message}
            </Alert>
          )}
        </div>

        {isSubmitting ? (
          <button>Aguarde...</button>
        ) : (
          <button type="submit">Entrar</button>
        )}
      </form>
    </>
  );
}
