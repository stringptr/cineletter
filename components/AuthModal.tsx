"use client";

import { useState } from "react";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#ffffff0f] text-white border border-[#ffffff1a] backdrop-blur-xl rounded-2xl p-8 w-[90%] max-w-md relative shadow-2xl animate-fadeIn">

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* ================= LOGIN ================= */}
        {isLogin ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center">Log In</h2>

            <form className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Username / Email address"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Password"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Log In
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-300">
              New to <span className="font-semibold">DBMSATRIA</span>?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                Sign up now.
              </span>
            </p>
          </>
        ) : (
          <>
            {/* ================= SIGN UP ================= */}
            <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>

            <form className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email address"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none"
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="bg-white/80 text-black border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                Log in now.
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}