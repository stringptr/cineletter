"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import LoginForm from "./LoginFrom.tsx"

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, _ and . allowed"),

  name: z.string().min(1, "Name is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  passwordVerif: z.string(),
}).refine(
  (data) => data.password === data.passwordVerif,
  {
    message: "Passwords do not match",
    path: ["passwordVerif"],
  }
);

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [credential, setCredential] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const signupForm = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      passwordVerif: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: value.username,
            email: value.email,
            name: value.name,
            password: value.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error ?? "signup-failed");
          return;
        }

        setIsLogin(true);
        signupForm.reset();
      } catch {
        setError("signup-failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!isOpen) return null;

  /* ================= LOGIN ================= */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "login-failed");
        return;
      }

      // success
      onClose();
      window.location.reload(); // or router.refresh()
    } catch {
      setError("login-failed");
    } finally {
      setIsLoading(false);
    }
  }

  /* ================= SIGNUP ================= */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (password !== passwordVerif) {
      setError("password-mismatch");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "signup-failed");
        return;
      }

      setIsLogin(true);
    } catch {
      setError("signup-failed");
    } finally {
      setIsLoading(false);
    }
  }

  function ErrorNotice() {
    if (!error) return null;

    switch (error) {
      case "taken":
        return "Username already used.";
      case "email-exist":
        return "Email already registered.";
      case "both-exist":
        return "Email and username already registered.";
      case "password-mismatch":
        return "Passwords do not match.";
      case "login-failed":
        return "Invalid credentials.";
      case "signup-failed":
        return "Failed to create account.";
      default:
        return "Something went wrong.";
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#ffffff0f] text-white border border-[#ffffff1a] backdrop-blur-xl rounded-2xl p-8 w-[90%] max-w-md relative shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {isLogin ? (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center">Log In</h2>

            <LoginForm
              onSuccess={() => {
                onClose();
                window.location.reload(); // or router.refresh()
              }}
            />

            <p className="text-sm text-center mt-6 text-gray-300">
              New here?{" "}
              <span
                onClick={() => {
                  setError("");
                  setIsLogin(false);
                }}
                className="font-semibold text-blue-400 cursor-pointer hover:underline"
              >
                Sign up now.
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                signupForm.handleSubmit();
              }}
              className="flex flex-col space-y-4"
            >
              <signupForm.Field
                name="username"
                validators={{
                  onChange: signupSchema.shape.username,
                }}
              >
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-white/80 text-black rounded-lg px-3 py-2"
                      placeholder="Username"
                    />

                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-sm text-red-400">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </div>
                )}
              </signupForm.Field>

              <signupForm.Field
                name="email"
                validators={{ onChange: signupSchema.shape.email }}
              >
                {(field) => (
                  <>
                    <input
                      type="email"
                      className="bg-white/80 text-black rounded-lg px-3 py-2"
                      placeholder="Email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-sm text-red-400">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </>
                )}
              </signupForm.Field>

              <signupForm.Field
                name="name"
                validators={{ onChange: signupSchema.shape.name }}
              >
                {(field) => (
                  <>
                    <input
                      className="bg-white/80 text-black rounded-lg px-3 py-2"
                      placeholder="Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-sm text-red-400">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </>
                )}
              </signupForm.Field>

              <signupForm.Field
                name="password"
                validators={{ onChange: signupSchema.shape.password }}
              >
                {(field) => (
                  <>
                    <input
                      type="password"
                      className="bg-white/80 text-black rounded-lg px-3 py-2"
                      placeholder="Password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-sm text-red-400">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </>
                )}
              </signupForm.Field>

              <signupForm.Field name="passwordVerif">
                {(field) => (
                  <>
                    <input
                      type="password"
                      className="bg-white/80 text-black rounded-lg px-3 py-2"
                      placeholder="Confirm password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors?.[0] && (
                      <p className="text-sm text-red-400">
                        {field.state.meta.errors[0].message}
                      </p>
                    )}
                  </>
                )}
              </signupForm.Field>

              {error && (
                <p className="text-sm text-red-400 text-center">
                  <ErrorNotice />
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !signupForm.state.canSubmit}
                className="bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setError("");
                  setIsLogin(true);
                }}
                className="font-semibold text-blue-400 cursor-pointer hover:underline"
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
