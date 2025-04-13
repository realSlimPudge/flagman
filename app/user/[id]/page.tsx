"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { User } from "@/shared/types/types";
import { host } from "@/shared/host/host";
import { useState } from "react";
import { LogoutModal } from "@/widgets/LogoutModal";
import { InvitationsModal } from "@/widgets/GetInviteModal";

interface ApiResponse {
  user: User;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Произошла ошибка");
  return res.json();
};

export default function UserPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const { id: userId } = useParams<{ id: string }>();
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] =
    useState<boolean>(false);

  const { data, error, isLoading } = useSWR<ApiResponse>(
    `${host}/user/${userId}`,
    fetcher,
    {
      refreshInterval: 20000,
      revalidateOnFocus: false,
    },
  );

  if (isLoading)
    return (
      <div
        className="w-10 h-10 rounded-full border-3 animate-spin absolute transform transtlate-x-[-50%]
      translate-y-[-50%] left-[47%] top-[50%] border-purple-600 border-t-transparent"
      ></div>
    );

  if (error) {
    if (error.message === "Not Found") {
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Пользователь не найден
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Вернуться на главную
          </Link>
        </div>
      );
    }

    if (error.message === "Unauthorized") {
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Требуется авторизация
          </h1>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Войти в систему
          </Link>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Ошибка загрузки данных
        </h1>
        <p className="text-gray-600">
          Пожалуйста, попробуйте обновить страницу
        </p>
      </div>
    );
  }

  const user = data?.user;
  if (!user) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
            <div className="absolute -bottom-8 left-6">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {user.FullName[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.FullName}
                </h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  <span>
                    Зарегистрирован:{" "}
                    {new Date(user.CreatedAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="border border-blue-500 gap-x-2 hover:bg-blue-100 flex items-center justify-center text-blue-500 px-3 py-2 rounded-xl"
              onClick={() => setIsInvitationsModalOpen(true)}
            >
              <Bell className="text-blue-500" size={20} />
              Показать приглашения
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Контактные данные
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="text-gray-600">{user.Email}</span>
                  </div>
                  {user.PhoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-gray-600">{user.PhoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-green-600" />
                  Организации
                </h2>
                <div className="flex flex-col gap-y-2">
                  {user.Enterprises?.length > 0 ? (
                    user.Enterprises.map((org) => (
                      <Link href={`/enterprise/${org.ID}`} key={org.ID}>
                        <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                          <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                          <span className="text-gray-600">{org.Name}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Пользователь не состоит в организациях
                    </p>
                  )}
                </div>
              </div>

              <div className="">
                <button
                  className="border border-red-500 gap-x-2 hover:bg-red-200 flex items-center justify-center text-red-500 px-3 py-2 rounded-xl"
                  onClick={() => {
                    setIsLogoutModalOpen(true);
                  }}
                >
                  <LogOut className="text-red-500" size={20} />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => {
          setIsLogoutModalOpen(false);
        }}
      />
      <InvitationsModal
        isOpen={isInvitationsModalOpen}
        onClose={() => setIsInvitationsModalOpen(false)}
        userId={userId}
      />
    </>
  );
}
