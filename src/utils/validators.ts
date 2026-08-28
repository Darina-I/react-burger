const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

type ValidatorRule = {
  validator: (value: string) => boolean;
  message: string;
  allowEmpty?: boolean;
};

export const validators: Record<string, ValidatorRule> = {
  name: {
    validator: (value) => NAME_REGEX.test(value.trim()),
    message: 'Укажите корретное имя.',
    allowEmpty: false,
  },
  email: {
    validator: (value) => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
    allowEmpty: false,
  },
  password: {
    validator: (value) => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
    allowEmpty: false,
  },
  newPassword: {
    validator: (value) => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
    allowEmpty: true,
  },
};
