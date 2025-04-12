import * as yup from "yup";
export const registerSchema = yup.object().shape({
  fullname: yup.string().required("ФИО обязательно"),
  email: yup.string().email("Некорректный Email").required("Email обязателен"),
  password: yup
    .string()
    .min(8, "Пароль должен быть минимум 8 символов")
    .max(50, "Пароль должен быть меньше 50 символов")
    .required("Пароль обязателен"),
  phonenumber: yup
    .string()
    .matches(/^\+?[1-9]\d{10}$/, "Некорректный номер телефона")
    .required("Телефон обязателен"),
});
