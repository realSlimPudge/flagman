import { host } from "@/shared/host/host";
import { User } from "@/shared/types/types";
import { Building2, CalendarDays, Mail, Phone } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

interface apiRes {
  user: User;
}
export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("jwt")?.value;
  const { id: userId } = await params;

  try {
    const res = await fetch(`${host}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //Пользователь не найден
    if (res.status === 404) {
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
    //Ошибка
    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }
    //Не авторизован
    if (res.status === 401) {
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

    const { user }: apiRes = await res.json();
    // console.log(user);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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
                <div className="space-y-3">
                  {user.Organizations?.length > 0 ? (
                    user.Organizations.map((org) => (
                      <div
                        key={org.ID}
                        className="flex items-center bg-white p-3 rounded-md shadow-sm"
                      >
                        <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="text-gray-600">{org.Name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Пользователь не состоит в организациях
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Ошибка загрузки данных пользователя
        </h1>
        <p className="text-gray-600">
          Пожалуйста, попробуйте обновить страницу
        </p>
      </div>
    );
  }
}
