"use client";
import { host } from "@/shared/host/host";
import { Document } from "@/shared/types/types";
import { useEffect, useState } from "react";

interface DocumentWidgetProps {
  status: "pending" | "signed" | "rejected";
  title: string;
}

export const DocumentWidget = ({ status, title }: DocumentWidgetProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${host}/document/list?status=${status}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Ошибка загрузки документов");

        const data = await response.json();
        setDocuments(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [status]);
  useEffect(() => {
    console.log(documents);
  }, [documents]);
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      </div>

      {loading ? (
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
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{doc.Title}</h4>
                    <p className="text-sm text-gray-500">
                      {doc.Sender.FullName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{doc.CreatedAt}</span>
                </div>
              </div>
            ))
          ) : (
            <p>Нет документов</p>
          )}
        </div>
      )}
    </div>
  );
};
