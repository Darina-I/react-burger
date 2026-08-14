import { useFormWithValidation } from '@/hooks/useFormWithValidation';
import { usePasswordResetMutation } from '@/services/user/authApi';
import { setResetFlag } from '@/utils/resetPassword';
import { validators } from '@/utils/validators';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './forgot-password.module.css';

const initialValues = {
  email: '',
};

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange, isValid } = useFormWithValidation(initialValues);
  const [passwordReset] = usePasswordResetMutation();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    try {
      await passwordReset(values);
      setResetFlag();
      void navigate('/reset-password');
    } catch {
      alert('Не удалось отправить запрос на сброс пароля.');
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
        <EmailInput
          name="email"
          placeholder="Укажите e-mail"
          value={values.email}
          onChange={handleChange}
          errorText={validators.email.message}
        />
        <Button htmlType="submit" type="primary">
          Восстановить
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
