import { cookies } from "next/headers";
import { cache } from "react";
import AuthNavClient from "./AuthNavClient";
import { details } from "@/services/user/user";

// cache per-user so updates can invalidate
const getCachedAccount = cache(async (sessionId: string) => {
  return details();
});

export default async function AuthNav() {
  const sessionCookie = cookies().get("session");

  if (!sessionCookie) {
    return <AuthNavClient user={null} />;
  }

  const user = await getCachedAccount(sessionCookie.value);

  // session invalid or expired
  if (!user) {
    return <AuthNavClient user={null} />;
  }

  return <AuthNavClient user={user} />;
}
