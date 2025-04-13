"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PenLine, X } from "lucide-react";
import { host } from "@/shared/host/host";

interface SignDocumentModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentModal = ({
  documentId,
  isOpen,
  onClose,
  onSuccess,
}: SignDocumentModalProps) => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSignDocument = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${host}/document/sign/${documentId}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error("Ошибка подписания");

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 backdrop-opacity-20 backdrop-blur-3xl backdrop-brightness-[10%] backdrop-grayscale-100 z-20 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold">Подписание документа</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-3">
          <p className="text-gray-400 text-sm">
            На вашу электронную почту придет код, введите его в поле ниже
          </p>
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите вашу подпись"
          className="w-full p-2 border rounded-md mb-4 text-center border-gray-400 outline-none focus:border-purple-600"
          disabled={isSubmitting}
        />

        <button
          onClick={handleSignDocument}
          disabled={!code || isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-purple-600 w-5/6 mx-auto rounded-xl px-4 py-2  text-white 
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <PenLine className="w-4 h-4" />
              Подписать
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};
