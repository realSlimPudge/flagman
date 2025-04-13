"use client";

import { motion } from "motion/react";
import { host } from "@/shared/host/host";
import { DocumentRecipient } from "@/shared/types/types";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Download,
  CheckCircle,
  XCircle,
  PenLine,
  User,
  File,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { DocumentModal } from "@/widgets/DocumentModal";
import { RejectDocumentModal } from "@/widgets/RejectDocumentModal";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Произошла ошибка");
  return res.json();
};
interface DocumentApiResponese {
  body: DocumentRecipient;
}

export default function DocumentPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    data: responseData,
    error,
    isLoading,
    mutate,
  } = useSWR<DocumentApiResponese>(`${host}/document/${id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const handleSignDocument = async () => {
    try {
      const response = await fetch(
        `${host}/document/sign/${document?.ID}/request`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Ошибка подписания");
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  const handleRejectDocument = async () => {
    try {
      const response = await fetch(`${host}/document/reject/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка отклонения");
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  const document = responseData?.body;

  if (isLoading)
    return (
      <div
        className="w-10 h-10 rounded-full border-3 animate-spin absolute transform transtlate-x-[-50%]
      translate-y-[-50%] left-[47%] top-[50%] border-purple-600 border-t-transparent"
      ></div>
    );
  if (error)
    return <div className="text-red-500 p-8">Ошибка: {error.message}</div>;
  if (!document) return <div className="p-8">Документ не найден</div>;

  return (
    <>
      <motion.section
        className="max-w-4xl p-6 bg-white rounded-lg shadow-md my-24 w-10/12 mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <h1 className=" break-all break-words max-w-full text-2xl font-bold flex items-center gap-2">
            <File className="w-6 h-6" />
            {document.Document?.Title}
          </h1>
          <div
            className={`px-3 py-1 rounded-full text-sm ${document.Status === "signed"
                ? "bg-green-100 text-green-700"
                : document.Status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {document.Status === "signed" && "Подписан"}
            {document.Status === "rejected" && "Отклонён"}
            {document.Status === "pending" && "На рассмотрении"}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Дата создания</p>
                <p className="font-medium">
                  {document.Document?.CreatedAt
                    ? format(
                      new Date(document.Document.CreatedAt),
                      "d MMMM yyyy, HH:mm",
                      { locale: ru },
                    )
                    : "Не указана"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Последнее обновление
                </p>
                <p className="font-medium">
                  {document.Document?.UpdatedAt
                    ? format(
                      new Date(document.Document.UpdatedAt),
                      "d MMMM yyyy, HH:mm",
                      { locale: ru },
                    )
                    : "Не указана"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3 text-gray-500">
              <User className="w-5 h-5" />
              <h3 className="font-medium">Отправитель</h3>
            </div>
            <div className="space-y-1">
              <p className="font-medium">
                {document.Document?.Sender?.FullName}
              </p>
              <p className="text-sm text-gray-600">
                {document.Document?.Sender?.Email}
              </p>
              <p className="text-sm text-gray-600">
                {document.Document?.Sender?.PhoneNumber}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3 text-gray-500">
              <Download className="w-5 h-5" />
              <h3 className="font-medium">Документ</h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <p className="font-medium break-all break-words max-w-full">
                  {document.Document?.Title}
                </p>
                <p className="text-sm text-gray-600">PDF документ</p>
              </div>
              <a
                href={document.Document?.FilePath}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Скачать
              </a>
            </div>
          </div>

          {document.Status === "signed" && document.SignedAt && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-medium">Подписано</h3>
              </div>
              <p>
                {new Date(document.SignedAt).toLocaleDateString() || "Нет даты"}
              </p>
            </div>
          )}

          {document.Status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  handleSignDocument();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl  
              flex items-center justify-center gap-2 transition-colors"
              >
                <PenLine className="w-4 h-4" />
                Подписать документ
              </button>
              <button
                onClick={() => {
                  setIsRejectModalOpen(true);
                }}
                className="w-fit mx-auto px-4 py-2 border-[1px] border-red-500 text-red-500 rounded-xl  
              flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Отклонить документ
              </button>
            </div>
          )}
        </div>
      </motion.section>
      <DocumentModal
        documentId={id}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSuccess={mutate}
      />
      <RejectDocumentModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={async () => {
          await handleRejectDocument();
          mutate();
        }}
      />
    </>
  );
}
