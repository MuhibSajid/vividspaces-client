import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { JwtSync } from "@/components/auth/jwt-sync";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "VividSpaces — Book Creative Workspaces & Production Studios",
    template: "%s | VividSpaces",
  },
  description:
    "Discover and book vetted photography studios, cinema sound stages, podcast lounges, music suites, and art workshops by the hour. Peer-to-peer studio sharing built for creators.",
  keywords: [
    "VividSpaces",
    "studio rental",
    "photography studio",
    "podcast room",
    "sound stage",
    "music recording suite",
    "creative workspace",
    "peer-to-peer studio booking",
  ],
  authors: [{ name: "VividSpaces Team" }],
  openGraph: {
    title: "VividSpaces — Peer-to-Peer Creative Studio Marketplace",
    description:
      "Hourly access to top-rated photo studios, sound stages, and creative workspaces—vetted by creators, ready the moment you arrive.",
    siteName: "VividSpaces",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <JwtSync />
            <Suspense fallback={<div className="h-16 border-b border-zinc-200 dark:border-zinc-800" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </ThemeProvider>
      </body>
    </html>
  );
}