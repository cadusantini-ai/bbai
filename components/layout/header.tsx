"use client";

import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/login");
  }

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-950">
      <h1 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{title}</h1>
      <button onClick={handleLogout} className="flex items-center gap-2 group">
        <span className="text-xs text-zinc-400 group-hover:text-zinc-600 transition-colors">
          {user?.displayName ?? user?.email}
        </span>
        <Avatar className="h-7 w-7">
          <AvatarImage src={user?.photoURL ?? undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </button>
    </header>
  );
}
