import { useAppSelector } from '@/hooks/useAppHooks';
import { useFormWithValidation } from '@/hooks/useFormWithValidation';
import { useUpdateUserMutation } from '@/services/user/userApi';
import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent } from 'react';

import styles from './profile-form.module.css';

const initialValues = {
  name: '',
  email: '',
};

export const ProfileForm = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.user.user) ?? initialValues;
  const originalValues = { ...user, newPassword: '' };
  const { values, handleChange, isValid, reset } = useFormWithValidation(originalValues);
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    const hasChange =
      originalValues.name !== values.name ||
      originalValues.email !== values.email ||
      values.newPassword.length > 0;

    setIsEditing(hasChange);
  }, [values, originalValues]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    const data = {
      name: values.name,
      email: values.email,
      password: values.newPassword,
    };

    await updateUser(data).unwrap();
    setIsEditing(false);
  };

  const handleReset = (): void => {
    reset(originalValues);
    setIsEditing(false);
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e: FormEvent) => void handleSubmit(e)}
      onReset={() => handleReset()}
    >
      <Input
        name="name"
        placeholder="Имя"
        value={values.name}
        onChange={handleChange}
        icon="EditIcon"
      />
      <EmailInput
        name="email"
        placeholder="Логин"
        value={values.email}
        onChange={handleChange}
        isIcon={true}
      />
      <PasswordInput
        name="newPassword"
        placeholder="Пароль"
        value={values.newPassword}
        onChange={handleChange}
        icon="EditIcon"
      />
      {isEditing && (
        <div>
          <Button htmlType="reset" extraClass="mr-10">
            Отмена
          </Button>
          <Button htmlType="submit">Сохранить</Button>
        </div>
      )}
    </form>
  );
};
