"use client";
import { motion } from "motion/react";
import { host } from "@/shared/host/host";
import { DocumentRecipient } from "@/shared/types/types";
import Link from "next/link";
import useSWR from "swr";

interface DocumentWidgetProps {
  status: "pending" | "signed" | "rejected";
  title: string;
  delay: number;
}
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Произошла ошибка");
  return res.json();
};

export const DocumentWidget = ({
  status,
  title,
  delay,
}: DocumentWidgetProps) => {
  const {
    data: responseData,
    error,
    isLoading,
  } = useSWR<{ data: DocumentRecipient[] }>(
    `${host}/document/list?status=${status}`,
    fetcher,
    {
      refreshInterval: 20000,
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const documents = responseData?.data || [];
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "signed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
    }
  };

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Загрузка...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : documents.length === 0 ? (
        <div className="text-gray-500">Документов нет</div>
      ) : (
        <div className="space-y-4">
          {documents.length ? (
            documents.map((doc) => (
              <div
                key={doc.ID}
                className="p-4 border border-gray-400 rounded-lg hover:border-purple-400 transition-colors"
              >
                <Link
                  href={{
                    pathname: `/document/list/${doc.ID}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{doc.Document.Title}</h4>
                      <p className="text-sm text-gray-500">
                        {doc.Document.Sender.FullName}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.Document.CreatedAt).toLocaleDateString() ||
                        "Нет даты"}
                    </span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Нет документов</p>
          )}
        </div>
      )}
    </motion.article>
  );
};
