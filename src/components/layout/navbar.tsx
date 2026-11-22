"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  CalendarCheck,
  ChevronDown,
  CirclePlus,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how" },
  { label: "About Us", href: "/#guarantee" },
];

const ACCOUNT_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: CirclePlus },
  { label: "My Studio Listings", href: "/my-listings", icon: LayoutGrid },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isPending, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    toast.success("You have been logged out.");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Primary"
      >
        {/* Logo */}
       <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="VividSpaces logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <span className="text-lg font-semibold tracking-tight">
              Vivid<span className="text-coral-500">Spaces</span>
            </span>
          </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 transition ${
                    active
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

                    {isPending ? (
            <div className="h-9 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 p-1 pr-2 transition hover:shadow-md dark:border-zinc-800"
                  />
                }
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 rounded-2xl p-1.5"
              >
                <div className="flex items-center gap-3 px-3 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem
                    key={href}
                    render={<Link href={href} />}
                    className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-sm"
                  >
                    <Icon className="h-4 w-4 text-zinc-500" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-sm text-coral-600 dark:text-coral-400"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 sm:inline-flex dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 sm:inline-flex dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Register
              </Link>
            </>
          )}
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="border-b border-zinc-200 p-4 dark:border-zinc-800">
              <SheetTitle className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8" />
              Vivid<span className="-ml-1.5 text-coral-500">Spaces</span>
            </SheetTitle>
          </SheetHeader>

          <ul className="space-y-1 p-3">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-zinc-100 dark:bg-zinc-800"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {!user && (
            <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
              <Link
                href="/signin"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 sm:inline-flex dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 sm:inline-flex dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Register
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
