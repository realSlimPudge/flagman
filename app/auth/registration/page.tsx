"use client";
import { motion } from "motion/react";
import { Register } from "@/shared/types/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/shared/schmas/registration";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RegistrationPage() {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Register>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: Register) => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Попробуйте позже");
      }
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Link
        href="/"
        className="absolute top-[5%] left-[5%] flex items-center gap-x-3"
      >
        <ArrowLeft size={18} />
        Главная страница
      </Link>
      <motion.div
        className="shadow-md p-4 border-[1px] border-gray-300 w-10/12 h-fit mx-auto rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-bold text-2xl">Создание аккаунта</p>
        <p className="font-light text-md text-gray-900">
          Введите свою информацию для создания аккаунта
        </p>
        <form className="space-y-3 mt-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Электронная почта
            </label>
            <div className="mt-1">
              <input
                placeholder="example@gmail.com"
                {...register("email")}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ФИО
            </label>
            <div className="mt-1">
              <input
                placeholder="Иванов Иван Иванович"
                {...register("fullname")}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.fullname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullname.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Номер телефона
            </label>
            <div className="mt-1">
              <input
                placeholder="+79993332211"
                {...register("phonenumber")}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.phonenumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phonenumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phonenumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <div className="mt-1">
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Зарегистрироваться
            </button>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>
              Уже есть аккаунт?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
