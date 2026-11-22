import type { Metadata } from "next";

import { NotFoundView } from "@/components/shared/not-found-view";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <NotFoundView
      title="This page doesn't exist"
      description="The link may be broken, or the page may have moved. Let's get you back to the studios."
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Explore studios", href: "/studios" }}
    />
  );
}
