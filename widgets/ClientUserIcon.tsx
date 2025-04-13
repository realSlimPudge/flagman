"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ClientUserIcon = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="));

      const userId = cookies?.split("=")[1];
      setUserId(userId || null);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  if (!userId) return null;

  return (
    <Link
      href={`/user/${userId}`}
      className="z-10 rounded-[100%] fixed transform translate-[-50%,-50%] right-[5%] top-[3%] w-10 h-10 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600"
    >
      <User color="white" />
    </Link>
  );
};
