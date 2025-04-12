"use client";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Login } from "@/shared/types/types";
import { loginSchema } from "@/shared/schmas/login";
import { host } from "@/shared/host/host";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: Login) => {
    try {
      const res = await fetch(`${host}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Нет такого пользователя");
      }
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <motion.div
        className="shadow-md p-4 border-[1px] border-gray-300 w-10/12 h-fit mx-auto rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-bold text-2xl">Вход в аккаунт</p>
        <p className="font-light text-md text-gray-900">
          Введите свои данные для входа в аккаунт
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Электронная почта
            </label>
            <div className="mt-1">
              <input
                {...register("email")}
                type="email"
                placeholder="example@mail.com"
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
              Пароль
            </label>
            <div className="mt-1">
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
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
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Нет аккаунта?{" "}
              <Link
                href="/auth/registration"
                className="text-blue-600 hover:underline"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
