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
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="font-semibold text-sm text-foreground">{title}</h1>
      <button onClick={handleLogout} className="flex items-center gap-2.5 group">
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {user?.displayName ?? user?.email}
        </span>
        <Avatar className="h-7 w-7 ring-1 ring-border">
          <AvatarImage src={user?.photoURL ?? undefined} />
          <AvatarFallback className="text-xs bg-secondary text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>
    </header>
  );
}
