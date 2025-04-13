"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { host } from "@/shared/host/host";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EnterpriseForm } from "@/shared/types/types";
import { EnterpriseSchema } from "@/shared/schmas/enterprise";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnterpriseForm>({
    resolver: yupResolver(EnterpriseSchema),
  });

  const onSubmit = async (data: EnterpriseForm) => {
    try {
      setIsLoading(true);
      setServerError("");

      const response = await fetch(`${host}/enterprise/create`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при создании организации");
      }
      reset();
      router.push("/enterprise");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Link
        href="/enterprise"
        className="absolute top-[4%] left-[5%] flex items-center gap-x-3"
      >
        <ArrowLeft size={18} />
        Назад к организациям
      </Link>

      <motion.div
        className="shadow-md p-4 border-[1px] border-gray-300 w-10/12 h-fit mx-auto rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-8 gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Создать новую организацию</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название организации *
            </label>
            <div className="mt-1">
              <input
                {...register("name")}
                type="text"
                placeholder="Введите название"
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <div className="mt-1">
              <textarea
                {...register("description")}
                placeholder="Добавьте описание организации"
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                rows={4}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {serverError && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Создать организацию"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
