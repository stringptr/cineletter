"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function AuthNavClient() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/details")
      .then(async (r) => {
        console.log("Response status:", r.status);
        console.log("Response ok:", r.ok);

        const text = await r.text(); // Get raw text first
        console.log("Response text:", text);

        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }

        if (!text) {
          throw new Error("Empty response from server");
        }

        return JSON.parse(text); // Parse manually
      })
      .then((data) => {
        console.log("Parsed data:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#ffffff1a] flex items-center justify-center">
          <User className="w-5 h-5 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return (
      <>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowAuth(true)}
        >
          <span className="hidden sm:inline text-white hover:text-[#ffffffb3] text-sm transition">
            Sign In
          </span>
          <div className="w-9 h-9 rounded-full bg-[#ffffff1a] hover:bg-[#ffffff33] flex items-center justify-center transition">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />
      </>
    );
  }

  // LOGGED IN
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-9 h-9 rounded-full bg-[#ffffff33] flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <span className="hidden sm:inline text-white text-sm">
        {user.name}
      </span>
    </div>
  );
}
