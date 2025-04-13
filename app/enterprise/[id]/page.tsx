"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { Building2, CalendarDays, Users, Layers, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { host } from "@/shared/host/host";
import { Enterprise } from "@/shared/types/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { InviteModal } from "@/widgets/InviteModal";
import Link from "next/link";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());
export default function OrganizationPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR<{ body: Enterprise }>(
    `${host}/enterprise/${id}`,
    fetcher,
  );
  const enterpriseId = parseInt(id);

  const handleInvite = async (email: string) => {
    const response = await fetch(`${host}/enterprise/invite`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ enterprise_id: enterpriseId, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send invitation");
    }
  };

  if (isLoading)
    return (
      <div
        className="w-10 h-10 rounded-full border-3 animate-spin absolute transform transtlate-x-[-50%]
      translate-y-[-50%] left-[47%] top-[50%] border-purple-600 border-t-transparent"
      ></div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">
          Ошибка загрузки данных
        </h2>
        <p className="text-gray-600 mt-2">
          Не удалось загрузить информацию об организации
        </p>
      </div>
    );

  const enterprise = data?.body;

  if (!enterprise)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Организация не найдена</h2>
      </div>
    );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-20"
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
            <div className="absolute -bottom-8 left-6">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {enterprise.Name}
                </h1>
                {enterprise.Description && (
                  <p className="mt-2 text-gray-600">{enterprise.Description}</p>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-fit flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  <Plus size={18} />
                  Пригласить
                </button>
                <Link href={`/enterprise/${id}/create`}>
                  Отправить документы
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4 text-gray-500">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Дата создания</h3>
                </div>
                <p className="text-gray-600">
                  {format(
                    new Date(enterprise.CreatedAt),
                    "d MMMM yyyy, HH:mm",
                    {
                      locale: ru,
                    },
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4 text-gray-500">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Последнее обновление</h3>
                </div>
                <p className="text-gray-600">
                  {format(
                    new Date(enterprise.UpdatedAt),
                    "d MMMM yyyy, HH:mm",
                    {
                      locale: ru,
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4 text-gray-500">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Пользователи</h3>
                </div>
                {enterprise.Users ? (
                  <ul className="space-y-2">
                    {enterprise.Users.map((user) => (
                      <li key={user.ID} className="text-gray-600">
                        {user.FullName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Пользователи не найдены</p>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4 text-gray-500">
                  <Layers className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Отделы</h3>
                </div>
                {enterprise.Departments ? (
                  <ul className="space-y-2">
                    {enterprise.Departments.map((department) => (
                      <li key={department.ID} className="text-gray-600">
                        {department.Name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Отделы не найдены</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <InviteModal
        enterpriseId={enterpriseId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </>
  );
}
