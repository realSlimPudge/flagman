"use client";
import { FileUp, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div
      className="absolute transform translate-x-[-50%]
     bottom-[3%] left-[50%] border-[1px] border-gray-300 bg-white rounded-full w-fit h-10
      "
    >
      <nav className="w-full h-full flex justify-center gap-x-2 items-center">
        <Link
          href="/"
          className={`h-[38px] w-[38px] flex  items-center transition-all duration-300 ease 
            justify-center rounded-full bg-gradient-to-r ${pathname === "/" && "bg-gradient-to-r from-blue-500 to-purple-600 "}`}
        >
          <Home
            size={24}
            className="duration-200 transition-all ease"
            color={` ${pathname === "/" ? "white" : "black"}`}
            strokeWidth={2}
          />
        </Link>
        <Link
          href="/document/create"
          className={`h-[38px] w-[38px] flex items-center transition-all duration-300 ease 
            justify-center rounded-full ${pathname === "/document/create" && "bg-gradient-to-r from-blue-500 to-purple-600 "}`}
        >
          <FileUp
            className="duration-200 transition-all ease"
            color={` ${pathname === "/document/create" ? "white" : "black"}`}
            strokeWidth={2}
          />
        </Link>
        <Link
          href="/document/list"
          className={`h-[38px] w-[38px] flex items-center transition-all duration-300 ease 
            justify-center rounded-full bg-transparent ${pathname === "/document/list" && "bg-gradient-to-r from-blue-500 to-purple-600 "}`}
        >
          <LayoutDashboard
            className="duration-200 transition-all ease"
            color={` ${pathname === "/document/list" ? "white" : "black"}`}
            strokeWidth={2}
          />
        </Link>
      </nav>
    </div>
  );
}
