"use client";

import useSWR from "swr";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { host } from "@/shared/host/host";

interface Enterprise {
  ID: number;
  Name: string;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export default function EnterprisesPage() {
  const { data, error, isLoading } = useSWR<{ body: Enterprise[] }>(
    `${host}/enterprise/my`,
    fetcher,
  );

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
          Ошибка загрузки предприятий
        </h2>
        <p className="text-gray-600 mt-2">
          Пожалуйста, попробуйте обновить страницу
        </p>
      </div>
    );

  const enterprises = data?.body;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Мои предприятия</h1>
        <Link
          href="/enterprise/create"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} />
          Добавить
        </Link>
      </div>

      {enterprises?.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {enterprises.map((enterprise) => (
            <Link
              key={enterprise.ID}
              href={`/enterprise/${enterprise.ID}`}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Building2 className="w-6 h-6 text-blue-500 mr-4" />
              <span className="text-lg">{enterprise.Name}</span>
            </Link>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-4" />
          <p>У вас пока нет созданных предприятий</p>
        </div>
      )}
    </div>
  );
}
