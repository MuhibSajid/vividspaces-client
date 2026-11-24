"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function JwtSync() {
  const { user, isPending } = useAuth();
  const email = user?.email;

  useEffect(() => {
    if (isPending) return;
    fetch("/api/token", { method: email ? "POST" : "DELETE" }).catch(() => {});
  }, [email, isPending]);

  return null;
}