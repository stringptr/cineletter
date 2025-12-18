"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, ChevronDown, Edit, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal"; // <<— MODAL RESMI

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [editSearch, setEditSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "TV-Show", path: "/tv-show" },
    { name: "Genre", path: "/genre" },
    { name: "Person", path: "/person" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-500 z-50
        ${
          isScrolled
            ? "top-4 bg-[#08092e] backdrop-blur-md px-6 py-2 rounded-full shadow-lg w-[80%] max-w-5xl border border-[#ffffff1a]"
            : "top-0 bg-[#08092e] w-full rounded-none shadow-md border-b border-[#ffffff1a]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 
          ${isScrolled ? "py-1" : "py-3"} max-w-7xl mx-auto`}
        >
          {/* LEFT: Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-[#ffffff] text-[#0d0d0d] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              D
            </div>
            <span
              className={`font-bold text-lg tracking-wide transition-all duration-300 ${
                isScrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              DBMSATRIA
            </span>
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
                    : "text-[#ffffff] hover:text-[#ffffffb3]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Executive Dropdown */}
            <div className="relative select-none" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className={`flex items-center gap-1 text-sm cursor-pointer transition ${
                  showDropdown ? "text-[#ff1212]" : "text-white hover:text-[#ffffffb3]"
                }`}
              >
                Executive Only
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    showDropdown ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {showDropdown && (
                <div className="absolute mt-2 right-0 bg-[#0f0f3a] border border-[#ffffff1a] rounded-lg shadow-lg w-40 py-2 z-50">
                  <Link
                    href="/executive/dashboard"
                    className="flex items-center no-underline gap-2 px-4 py-2 text-sm text-white hover:bg-[#1b1b5a] transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>

                  <div
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-[#1b1b5a] transition cursor-pointer"
                    onClick={() => {
                      setShowEditSearch(true);
                      setShowDropdown(false);
                    }}
                  >
                    <Edit className="w-4 h-4" /> Edit Data
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative hidden sm:block ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() !== "") {
                  router.push(`/movies/search/${encodeURIComponent(search.trim())}`);
                  setSearch("");
                }
              }}
                className="bg-[#ffffff0d] border border-[#ffffff1a] text-white placeholder-[#aaa] text-sm rounded-full pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ffffff40] focus:border-[#ffffff40] transition-all w-44 hover:w-56"
              />
            </div>
          </div>

          {/* RIGHT: Auth Trigger */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAuth(true)}>
            <span className="hidden sm:inline text-white hover:text-[#ffffffb3] text-sm transition">
              Sign Up / Log In
            </span>
            <div className="w-9 h-9 rounded-full bg-[#ffffff1a] hover:bg-[#ffffff33] flex items-center justify-center transition">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* POPUP EDIT SEARCH */}
      {showEditSearch && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#ffffff0f] backdrop-blur-xl border border-[#ffffff1a] rounded-2xl p-8 w-[90%] max-w-md relative shadow-2xl text-white">
            <button
              onClick={() => setShowEditSearch(false)}
              className="absolute top-4 right-4 text-black hover:text-[#ff0000] text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">Search Movie to Edit</h2>

            <input
              type="text"
              placeholder="Search movie..."
              value={editSearch}
              onChange={(e) => setEditSearch(e.target.value)}
              className="w-105 p-3 rounded-lg bg-white/80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5"
            />

            <button
              className="w-full bg-[#121ec4] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              onClick={() => {
                if (editSearch.trim() !== "") {
                  router.push(`/executive/edit/list?search=${encodeURIComponent(editSearch)}`);
                  setShowEditSearch(false);
                  setEditSearch("");
                }
              }}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* POPUP AUTH — MODAL RESMI DARI COMPONENTS */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

    </>
  );
}