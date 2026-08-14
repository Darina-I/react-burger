import { useFormWithValidation } from '@/hooks/useFormWithValidation';
import { useLoginMutation } from '@/services/user/authApi';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import type { FormEvent } from 'react';

import styles from './login.module.css';

type LoginLocationState = {
  from?: { pathname: string; search?: string; hash?: string };
};

const initialValues = {
  email: '',
  password: '',
};

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange } = useFormWithValidation(initialValues);
  const [login] = useLoginMutation();
  const location = useLocation();
  const { state } = location as { state: LoginLocationState | undefined };
  const from = state?.from ?? { pathname: '/' };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await login(values).unwrap();
    void navigate(from.pathname ?? '/', { replace: true });
  };

  return (
    <main className={styles.main}>
      <p className="text text_type_main-medium mb-6">Вход</p>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent) => {
          void handleSubmit(e);
        }}
      >
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={values.email}
          onChange={handleChange}
        />
        <PasswordInput
          name="password"
          placeholder="Пароль"
          value={values.password}
          onChange={handleChange}
        />
        <Button htmlType="submit" type="primary">
          Войти
        </Button>
      </form>
      <div className={`${styles.link} mt-20 mb-4`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы - новый пользователь?
        </p>
        <Button
          htmlType="button"
          onClick={() => void navigate('/register')}
          size="medium"
          type="secondary"
          extraClass="p-1"
        >
          Зарегистрироваться
        </Button>
      </div>
      <div className={`${styles.link}`}>
        <p className="text text_type_main-default text_color_inactive">Забыли пароль?</p>
        <Button
          extraClass="p-1"
          htmlType="button"
          onClick={() => void navigate('/forgot-password', { state: { from } })}
          size="medium"
          type="secondary"
        >
          Восстановить пароль
        </Button>
      </div>
    </main>
  );
};
