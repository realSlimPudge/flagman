import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Некорректный email").required("Email обязателен"),
  password: yup.string().required("Введите пароль"),
});
