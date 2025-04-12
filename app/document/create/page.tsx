"use client";

import { host } from "@/shared/host/host";
import { User } from "@/shared/types/types";
import { useEffect, useState } from "react";

export default function DocumentCreate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  const getUsers = async () => {
    try {
      const res = await fetch(`${host}/user/all`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при загрузке пользователей");
      }

      const data = await res.json();
      setUsers(data.data);
      setUsersLoading(false);
    } catch (e) {
      setUsersLoading(false);
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // const toggleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedUsers([]);
  //   } else {
  //     const allUserIds = users.map((user) => Number(user.ID));
  //     setSelectedUsers(allUserIds);
  //   }
  //   setSelectAll(!selectAll);
  // };

  const handleUserSelect = (userId: number) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });

    if (selectedUsers.length + 1 === users.length) {
      setSelectAll(true);
    } else if (selectAll) {
      setSelectAll(false);
    }
  };

  // const isIndeterminate =
  //   selectedUsers.length > 0 && selectedUsers.length < users.length;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedFile) {
      setError("Пожалуйста, выберите файл");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Пожалуйста, выберите хотя бы одного пользователя");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("recipients", JSON.stringify(selectedUsers));
    try {
      console.log(selectedUsers);
      setLoading(true);
      const res = await fetch(`${host}/document/create`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Ошибка при отправке");
      }

      setSuccess(true);
      setSelectedFile(null);
      setSelectedUsers([]);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else if (typeof e === "string") {
        setError(e);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center">
      <div className="max-w-10/12 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Отправить документ</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Выберите документ (PDF или DOCX)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow tracking-wide uppercase border border-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="text-sm">
                  {selectedFile
                    ? selectedFile.name
                    : "Нажмите для выбора файла"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Выберите пользователей
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
              {usersLoading ? (
                <div>Загрузка пользователей...</div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.ID}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <label className="flex items-center space-x-3 w-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.ID)}
                        onChange={() => handleUserSelect(user.ID)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">{user.FullName}</p>
                      </div>
                    </label>
                  </div>
                ))
              ) : (
                <div>Не найдено пользователей</div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              Документ успешно отправлен!
            </div>
          )}

          <button
            type="submit"
            disabled={loading || usersLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Отправка..." : "Отправить документ"}
          </button>
        </form>
      </div>
    </div>
  );
}
