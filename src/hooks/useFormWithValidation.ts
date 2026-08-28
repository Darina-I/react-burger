import { useState, type ChangeEvent } from 'react';

import { validators } from '@utils/validators.js';

type FormValues = Record<string, string>;

export function useFormWithValidation<T extends FormValues>(
  initialValues: T = {} as T
): {
  values: T;
  errors: Record<keyof T, boolean>;
  isValid: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  reset: (newValues: T) => void;
} {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initErrors(initialValues));
  const [isValid, setIsValid] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const input = event.target;
    const value = input.value;
    const name = input.name;

    const newValues = {
      ...values,
      [name]: value,
    };

    setValues(newValues);

    const newErrors = validateForm(newValues);

    setErrors(newErrors);

    const allFieldsValid = Object.values(newErrors).every(Boolean);
    setIsValid(allFieldsValid);
  }

  function reset(newValues: T): void {
    setValues(newValues);
    const newErrors = initErrors(newValues);
    setErrors(newErrors);

    const allFieldsValid = Object.values(newErrors).every(Boolean);
    setIsValid(allFieldsValid);
  }

  return { values, handleChange, errors, isValid, reset };
}

function initErrors<T extends FormValues>(formValues: T): Record<keyof T, boolean> {
  return Object.keys(formValues).reduce(
    (errors, fieldName) => {
      (errors as Record<string, boolean>)[fieldName] = false;
      return errors;
    },
    {} as Record<keyof T, boolean>
  );
}

function validateForm<T extends FormValues>(formValues: T): Record<keyof T, boolean> {
  const nextErrors: Record<string, boolean> = {};

  for (const [fieldName, fieldValue] of Object.entries(formValues)) {
    const normalizedValue =
      typeof fieldValue === 'string' ? fieldValue.trim() : fieldValue;
    const isEmptyValue = normalizedValue === '' || normalizedValue === undefined;

    const config = validators[fieldName];
    const allowEmpty = config?.allowEmpty ?? false;

    if (allowEmpty && isEmptyValue) {
      nextErrors[fieldName] = true;
      continue;
    }

    const isFieldValid = isEmptyValue
      ? false
      : (validators[fieldName]?.validator(normalizedValue) ?? true);

    nextErrors[fieldName] = isFieldValid;
  }

  return nextErrors as Record<keyof T, boolean>;
}
