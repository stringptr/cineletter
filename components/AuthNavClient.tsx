"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";

type UserDetail = {
  name: string | null;
};

export default function AuthNavClient() {
  const openModal = useAuthModal((s) => s.openModal);

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/detail")
      .then(async (r) => {
        if (!r.ok) return null;
        const text = await r.text();
        return text ? JSON.parse(text) : null;
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#ffffff1a] flex items-center justify-center">
          <User className="w-5 h-5 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  /* ---------- NOT LOGGED IN ---------- */
  if (!user) {
    return (
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={openModal}
      >
        <span className="hidden sm:inline text-white hover:text-[#ffffffb3] text-sm transition">
          Sign In
        </span>
        <div className="w-9 h-9 rounded-full bg-[#ffffff1a] hover:bg-[#ffffff33] flex items-center justify-center transition">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  /* ---------- LOGGED IN ---------- */
  return (
    <Link className="flex items-center gap-2" href={`/user/${user.username}`}>
      <div className="w-9 h-9 rounded-full bg-[#ffffff33] flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <span className="hidden sm:inline text-white text-sm">
        {user.name ?? "User"}
      </span>
    </Link>
  );
}
