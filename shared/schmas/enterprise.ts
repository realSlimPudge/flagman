import * as yup from "yup";
export const EnterpriseSchema = yup.object({
  name: yup
    .string()
    .required("Название организации обязательно")
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов"),
  description: yup
    .string()
    .max(150, "Максимум 150 символов")
    .optional()
    .default(null),
});
