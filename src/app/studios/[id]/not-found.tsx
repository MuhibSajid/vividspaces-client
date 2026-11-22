import type { Metadata } from "next";

import { NotFoundView } from "@/components/shared/not-found-view";

export const metadata: Metadata = {
  title: "Studio not found",
  description: "This studio listing doesn't exist or is no longer available.",
};

export default function StudioNotFound() {
  return (
    <NotFoundView
      title="Studio not found"
      description="This listing may have been removed by its host, or the link is out of date."
      primary={{ label: "Explore studios", href: "/studios" }}
      secondary={{ label: "Back to home", href: "/" }}
    />
  );
}
