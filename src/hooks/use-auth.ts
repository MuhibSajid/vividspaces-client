"use client";

import { useState } from "react";

export type AuthUser = {
  name: string;
  email: string;
  image: string;
};

const MOCK_USER: AuthUser = {
  name: "Maya Okafor",
  email: "maya@halostudio.co",
  image: "/img/host.png",
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);

  return {
    user,
    isPending: false,
    login: () => setUser(MOCK_USER),
    logout: () => setUser(null),
  };
}