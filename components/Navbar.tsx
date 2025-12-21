"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import AuthNavClient from "./AuthNavClient.tsx";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [editSearch, setEditSearch] = useState("");

  // NEW: State to track if dashboard should be visible
  const [hasAccess, setHasAccess] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Titles", path: "/title" },
    { name: "Person", path: "/person" },
  ];

  useEffect(() => {
    // 1. Scroll Listener
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // 2. Fetch Roles to check access
    const checkRoles = async () => {
      try {
        const res = await fetch("/api/auth/role");
        if (!res.ok) return;

        const roles = await res.json();

        // Check if either array has at least one item
        const hasDbRoles = roles.database && roles.database.length > 0;
        const hasCompanyRoles = roles.company &&
          roles.company.length > 0;

        setHasAccess(hasDbRoles || hasCompanyRoles);
      } catch (error) {
        console.error("Failed to fetch roles", error);
        setHasAccess(false);
      }
    };

    checkRoles();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-500 z-50 ${
          isScrolled
            ? "top-4 bg-[#08092e] backdrop-blur-md px-6 py-2 rounded-full shadow-lg w-[80%] max-w-5xl border border-[#ffffff1a]"
            : "top-0 bg-[#08092e] w-full rounded-none shadow-md border-b border-[#ffffff1a]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "py-1" : "py-3"
          } max-w-7xl mx-auto`}
        >
          {/* LEFT: Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-[#ffffff] text-[#0d0d0d] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              D
            </div>
            {!isScrolled && (
              <span className="font-bold text-lg tracking-wide text-white">
                DBMSATRIA
              </span>
            )}
          </div>

          {/* CENTER: Menu */}
          <div className="flex items-center space-x-6 relative">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`no-underline transition text-sm ${
                  pathname === item.path
                    ? "text-[#ff1212]"
                    : "text-white hover:text-[#ffffffb3]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* CONDITIONALLY RENDER DASHBOARD */}
            {hasAccess && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1 text-sm transition no-underline ${
                  pathname.startsWith("/dashboard")
                    ? "text-[#ff1212]"
                    : "text-white hover:text-[#ffffffb3]"
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Search Input */}
            <div className="relative hidden sm:block ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    router.push(
                      `/search/title/${encodeURIComponent(search.trim())}`,
                    );
                  }
                }}
                className="bg-[#ffffff0d] border border-[#ffffff1a] text-white placeholder-[#aaa] text-sm rounded-full pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ffffff40] transition-all w-44 hover:w-56"
              />
            </div>
          </div>

          <AuthNavClient />
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
