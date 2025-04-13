"use client";

import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RejectDocumentModal = ({
  isOpen,
  onClose,
  onConfirm,
}: RejectDocumentModalProps) => {
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

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 backdrop-opacity-20 backdrop-blur-3xl backdrop-brightness-[10%] backdrop-grayscale-100 bg-opacity-50 px-4 "
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-50 bg-white rounded-lg p-6 w-full max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Отклонение документа
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Вы точно хотите отклонить этот документ? Это действие нельзя будет
          отменить.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                      disabled:bg-red-400 disabled:cursor-not-allowed transition-colors
                      flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Подтвердить"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
