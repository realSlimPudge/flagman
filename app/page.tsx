import { UploadIcon } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  const isAuthenticated = !!token;
  return (
    <section className="w-scren h-screen flex justify-center items-center px-2">
      <div className="text-center mb-16">
        <h1
          className="
        text-5xl font-bold text-gray-900 mb-6"
        >
          Онлайн подпись документов
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Безопасный обмен документами и совместная работа в реальном времени
        </p>
        {isAuthenticated ? (
          <Link
            href="/document/create"
            className="flex items-center w-fit mx-auto justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 rounded-xl text-white font-bold"
          >
            <UploadIcon className="mr-2 h-5 w-5" />
            Начать работу
          </Link>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/registration"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 rounded-xl text-white font-bold"
            >
              Зарегистрироваться
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
