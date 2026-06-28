"use client";

import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithEmail(email, password);
      const token = await credential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
      });
      router.replace("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithGoogle();
      const token = await credential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
      });
      router.replace("/dashboard");
    } catch {
      setError("Erro ao entrar com Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Entrar no BBAI</h1>
        <p className="text-sm text-zinc-500">Sua plataforma de gestão de saúde</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-2 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400">ou</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        Continuar com Google
      </button>

      <p className="text-center text-sm text-zinc-500">
        Não tem conta?{" "}
        <a href="/register" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
          Criar conta
        </a>
      </p>
    </div>
  );
}
