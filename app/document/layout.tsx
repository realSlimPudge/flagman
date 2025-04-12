import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("jwt");
  if (!token) {
    redirect("/auth/registration");
  }
  return <>{children}</>;
}
