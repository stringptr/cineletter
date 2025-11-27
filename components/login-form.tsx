"use client";

import { useState } from "react";
import Link from "next/link";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState({ success: false, error: "" });
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setLoginState({ success: false, error: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (!res.ok) {
        console.error(`HTTP Error: ${res.status} ${res.statusText}`);
        setLoginState({ success: false, error: "error" });
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await res.text());
        setLoginState({ success: false, error: "error" });
        return;
      }

      setLoginState(await res.json());
    } catch (error) {
      console.error("Login error:", error);
      setLoginState({ success: false, error: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  function ErrorNotice() {
    if (loginState.success) {
      return "Login successful!";
    }

    switch (loginState.error) {
      case "not-exist":
        return "Account with entered id doesn't exist.";
      case "wrong-password":
        return "Wrong password.";
      case "not-created":
        return "Fail to create session. Please try again.";
      case "error":
        return "Something wrong happened. Please try again.";
      default:
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Satria's Weirdness</span>
            </Link>

            <h1 className="text-xl font-bold">Welcome (Back?)</h1>

            <div className="text-center text-sm">
              Opps, new around here?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Join here
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                type="text"
                placeholder="Enter your ID."
                value={id}
                onChange={(e) => setID(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up and login, you agree to
        be<Link href="https://www.linuxatemyram.com">my dear audience</Link>
        {" "}
      </div>
    </div>
  );
}
