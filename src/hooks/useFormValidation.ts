import type { Rule } from "antd/es/form"

/**
 * Hook personalizado para reglas de validación comunes
 */
export const useFormValidation = () => {
  // Validación de email
  const emailRules: Rule[] = [
    { required: true, message: "Por favor ingresa tu email" },
    { type: "email", message: "El formato del email no es válido" },
    { max: 50, message: "El email no puede exceder los 50 caracteres" },
    {
      validator: (_, value) => {
        if (!value || value.trim() === value) {
          return Promise.resolve()
        }
        return Promise.reject("El email no debe contener espacios al inicio o final")
      },
    },
  ]

  // Validación de contraseña
  const passwordRules: Rule[] = [
    { required: true, message: "Por favor ingresa tu contraseña" },
    { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
    { max: 50, message: "La contraseña no puede exceder los 50 caracteres" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número",
    },
  ]

  // Validación de nombre
  const nameRules: Rule[] = [
    { required: true, message: "Por favor ingresa el nombre" },
    { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
    { max: 100, message: "El nombre no puede exceder los 100 caracteres" },
    {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/,
      message: "El nombre solo debe contener letras, espacios y puntos",
    },
  ]

  // Validación de texto requerido
  const requiredTextRules = (fieldName: string, minLength = 3, maxLength = 100): Rule[] => [
    { required: true, message: `Por favor ingresa ${fieldName}` },
    { min: minLength, message: `${fieldName} debe tener al menos ${minLength} caracteres` },
    { max: maxLength, message: `${fieldName} no puede exceder los ${maxLength} caracteres` },
  ]

  // Validación de confirmación de contraseña
  const confirmPasswordRules = (passwordField: string): Rule[] => [
    { required: true, message: "Por favor confirma tu contraseña" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue(passwordField) === value) {
          return Promise.resolve()
        }
        return Promise.reject("Las contraseñas no coinciden")
      },
    }),
  ]

  return {
    emailRules,
    passwordRules,
    nameRules,
    requiredTextRules,
    confirmPasswordRules,
  }
}
