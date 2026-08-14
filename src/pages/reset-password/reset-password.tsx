import { useFormWithValidation } from '@/hooks/useFormWithValidation';
import { useResetCodeMutation } from '@/services/user/authApi';
import { clearResetFlag, getResetFlag } from '@/utils/resetPassword';
import { validators } from '@/utils/validators';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './reset-password.module.css';

const initialValues = {
  token: '',
  password: '',
};

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange, isValid } = useFormWithValidation(initialValues);
  const [resetCode] = useResetCodeMutation();

  useEffect(() => {
    const hasFlag = getResetFlag();

    if (!hasFlag) {
      void navigate('/forgot-password');
      return;
    }
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    try {
      await resetCode(values);
      clearResetFlag();
      void navigate('/login');
    } catch {
      alert('Не удалось изменить пароль');
    }
  };

  return (
    <main className={styles.main}>
      <p className="text text_type_main-medium mb-6">Восстановление пароля</p>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent) => {
          void handleSubmit(e);
        }}
      >
        <PasswordInput
          name="password"
          placeholder="Введите новый пароль"
          value={values.password}
          onChange={handleChange}
          errorText={validators.password.message}
        />
        <Input
          name="token"
          placeholder="Введите код из письма"
          type="text"
          value={values.token}
          onChange={handleChange}
        />
        <Button htmlType="submit" type="primary">
          Сохранить
        </Button>
      </form>
      <div className={`${styles.link} mt-20 mb-4`}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?
        </p>
        <Button
          htmlType="button"
          onClick={() => void navigate('/login')}
          size="medium"
          type="secondary"
          extraClass="p-1"
        >
          Войти
        </Button>
      </div>
    </main>
  );
};
