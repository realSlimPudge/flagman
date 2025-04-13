"use client";
import { Building2, FileUp, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <aside
      className={`fixed transform translate-x-[-50%]
     bottom-[3%] left-[50%] border-[1px] border-gray-300 bg-white rounded-full w-fit h-10 duration-300 transition-all ease
      ${visible ? "translate-y-0" : "translate-y-[170%]"}`}
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
          href="/document/list"
          className={`h-[38px] w-[38px] flex items-center transition-all duration-300 ease 
            justify-center rounded-full bg-transparent ${pathname.startsWith("/document/list") && "bg-gradient-to-r from-blue-500 to-purple-600 "}`}
        >
          <LayoutDashboard
            className="duration-200 transition-all ease"
            color={` ${pathname.startsWith("/document/list") ? "white" : "black"}`}
            strokeWidth={2}
          />
        </Link>
        <Link
          href="/enterprise"
          className={`h-[38px] w-[38px] flex items-center transition-all duration-300 ease 
            justify-center rounded-full bg-transparent ${pathname.startsWith("/enterprise") && "bg-gradient-to-r from-blue-500 to-purple-600 "}`}
        >
          <Building2
            className="duration-200 transition-all ease"
            color={` ${pathname.startsWith("/enterprise") ? "white" : "black"}`}
            strokeWidth={2}
          />
        </Link>
      </nav>
    </aside>
  );
}
