"use client";
import { host } from "@/shared/host/host";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";

interface InvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}
interface NotificationResponse {
  body: Array<{
    ID: number;
    Email: string;
    EnterpriseName: string;
    EnterpriseID: number;
    CreatedBy: number;
  }>;
}
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Произошла ошибка");
  return res.json();
};
export const InvitationsModal = ({
  isOpen,
  onClose,
  userId,
}: InvitationsModalProps) => {
  const { data, error, isLoading } = useSWR<NotificationResponse>(
    isOpen ? `${host}/notification/my` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const handleAccept = async (invitation_id: number) => {
    const res = await fetch(`${host}/notification/accept`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        enterprise_id: data?.body.find((i) => i.ID === invitation_id)
          ?.EnterpriseID,
        invitation_id,
      }),
    });
    if (!res.ok) throw new Error("Проблема при получении приглашений");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 backdrop-opacity-20 backdrop-blur-3xl backdrop-brightness-[10%] backdrop-grayscale-100 bg-opacity-50 px-4"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-50 bg-white rounded-lg p-6 w-full max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Приглашения
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-4">
            Ошибка загрузки приглашений
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-h-96 overflow-y-auto">
            {data?.body?.length ? (
              data?.body.map((notification) => (
                <div
                  key={notification.ID}
                  className="p-4 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">
                        Приглашение в: {notification.EnterpriseName}
                      </div>
                      <div className="text-sm text-gray-600">
                        От: {notification.Email}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleAccept(notification.ID)}
                        className="text-green-600 hover:text-green-700 disabled:opacity-50"
                        title="Принять"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Нет активных приглашений
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
