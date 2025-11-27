"use client";

import { useState } from "react";
import Link from "next/link";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerif, setPasswordVerif] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [signupState, setSignUpState] = useState({ success: false, error: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setSignUpState({ success: false, error: "" });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, password }),
      });

      if (!res.ok) {
        console.error(`HTTP Error: ${res.status} ${res.statusText}`);
        setSignUpState({ success: false, error: "error" });
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await res.text());
        setSignUpState({ success: false, error: "error" });
        return;
      }

      setSignUpState(await res.json());
    } catch (error) {
      console.error("Signup error:", error);
      setSignUpState({ success: false, error: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  function ErrorNotice() {
    if (signupState.success) {
      return "Account successfully created!";
    }

    switch (signupState.error) {
      case "taken":
        return "ID already used. Try another.";
      case "not-created":
        return "Fail to create account. Please try again.";
      case "error":
        return ("Something wrong happened. Please try again.");
      default:
        return "";
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 overflow-hidden">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
            </Link>

            <h1 className="text-xl font-bold">Everyone is welcomed</h1>

            <div className="text-center text-sm">
              An old friend?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Go here
              </Link>
            </div>
            <ErrorNotice />
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Choose a Name."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                type="text"
                placeholder="Choose an ID."
                value={id}
                onChange={(e) => setID(e.target.value.toLowerCase())}
                required
              />
              <div
                hidden={id.length > 5}
                className="text-sm text-red-600"
              >
                ID have minimum 6 characters.
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                hidden={password.length >= 8}
                className="text-sm text-red-600"
              >
                Password have minimum 8 characters.
              </div>
              <Input
                id="passwordVerif"
                type="password"
                placeholder="Repeat the chosen password."
                value={passwordVerif}
                onChange={(e) => setPasswordVerif(e.target.value)}
                required
              />
              <div
                hidden={password === passwordVerif}
                className="text-sm text-red-600"
              >
                Password doesn't match.
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign Up
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
