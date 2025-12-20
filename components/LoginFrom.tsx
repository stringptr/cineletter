"use client";

import { useState } from "react";
import { z } from "zod"
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

const loginSchema = z.object({
  credential: z
    .string()
    .min(4, "Username or email is required"),
  password: z
    .string()
    .min(1, "Password must be at least 8 characters"),
});

export default function LoginForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      credential: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error ?? "login-failed");
        return;
      }

      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col space-y-4"
    >
      {/* Credential */}
      <form.Field
        name="credential"
        validators={{ onChange: loginSchema.shape.credential }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Username or Email"
              className={`${field.state.meta.errors?.length > 0 ? "bg-red-200" : "bg-white/80"} text-black rounded-lg px-3 py-2`}
            />

            {field.state.meta.touched?.length > 0 && (
              <p className="text-sm text-red-400">
                {field.state.meta.errors[0].message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password */}
      <form.Field
        name="password"
        validators={{ onChange: loginSchema.shape.password }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Password"
              className="bg-white/80 text-black rounded-lg px-3 py-2"
            />
          </div>
        )}
      </form.Field>

      {/* Server error */}
      {serverError && (
        <p className="text-sm text-red-400 text-center">
          {serverError === "login-failed"
            ? "Invalid credentials."
            : "Something went wrong."}
        </p>
      )}

      <button
        type="submit"
        disabled={form.state.isSubmitting}
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {form.state.isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
