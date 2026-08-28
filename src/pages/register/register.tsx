import { useFormWithValidation } from '@/hooks/useFormWithValidation';
import { useRegisterMutation } from '@/services/user/authApi';
import { validators } from '@/utils/validators';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import type { FormEvent } from 'react';
import type React from 'react';

import styles from './register.module.css';

const initialValues = {
  name: '',
  email: '',
  password: '',
};

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange, errors, isValid } = useFormWithValidation(initialValues);
  const [register] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    await register(values).unwrap();
  };

  const handleNavigate = (): void => {
    void navigate('/login');
  };

  return (
    <main className={styles.main}>
      <p className="text text_type_main-medium mb-6">Регистрация</p>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent) => {
          void handleSubmit(e);
        }}
      >
        <Input
          name="name"
          placeholder="Имя"
          value={values.name}
          onChange={handleChange}
          error={!errors.name && !!values.name}
          errorText={validators.name.message}
        />
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={values.email}
          onChange={handleChange}
          errorText={validators.email.message}
        />
        <PasswordInput
          name="password"
          placeholder="Пароль"
          value={values.password}
          onChange={handleChange}
          errorText={validators.password.message}
        />
        <Button htmlType="submit" type="primary">
          Зарегистрироваться
        </Button>
      </form>
      <div className={`${styles.link} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрирваны?
        </p>
        <Button
          extraClass="p-1"
          htmlType="button"
          onClick={handleNavigate}
          size="medium"
          type="secondary"
        >
          Войти
        </Button>
      </div>
    </main>
  );
};
