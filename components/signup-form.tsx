"use client"

import { useState } from "react"

import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVerif, setPasswordVerif] = useState("")
  const [signupState, setSignUpState] = useState("default")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setSignUpState("default") // Reset state

    try {
      if (password !== passwordVerif) {
        setSignUpState("non-match")
        return
      }

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, password }),
      });

      if (!res.ok) {
        console.error(`HTTP Error: ${res.status} ${res.statusText}`)
        setSignUpState("error")
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await res.text())
        setSignUpState("error")
        return
      }

      const data = await res.json()

      if (!data.success && data.error === "taken") {
        setSignUpState("taken")
      } else if (data.success) {
        setSignUpState("success")
      } else {
        setSignUpState("error")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setSignUpState("error")
    } finally {
      setIsLoading(false)
    }
  }

  function ErrorNotice() {
    switch (signupState) {
      case "taken":
        return (
          <div className="text-red-600 text-sm">
            Username is taken. Please try another.
          </div>
        )
      case "non-match":
        return (
          <div className="text-red-600 text-sm">
            Password doesn't match. Please retry.
          </div>
        )
      case "success":
        return (
          <div className="text-green-600 text-sm">
            Account successfully created!
          </div>
        )
      case "error":
        return (
          <div className="text-red-600 text-sm">
            Something went wrong. Please try again.
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Satria's Weirdness</span>
            </a>

            <h1 className="text-xl font-bold">Everyone is welcomed</h1>

            <div className="text-center text-sm">
              An old friend?{" "}
              <a href="/login" className="underline underline-offset-4">
                Go here
              </a>
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
              <Input
                id="passwordVerif"
                type="password"
                placeholder="Repeat the chosen password."
                value={passwordVerif}
                onChange={(e) => setPasswordVerif(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </div>
      </form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up and login, you agree to be<a href="https://www.linuxatemyram.com"> my dear audience</a>{" "}
      </div>
    </div>
  )
}
