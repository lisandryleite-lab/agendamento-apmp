"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { matricula, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError("Matrícula ou senha incorretos")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">CFO PM 2026</h1>
          <p className="text-slate-400 text-sm mt-1">Turma 13 · 1º Pelotão · 2ª CIA</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg">Entrar</h2>

          {error && <p className="text-red-400 text-sm bg-red-900/30 rounded px-3 py-2">{error}</p>}

          <div>
            <label className="text-slate-300 text-sm block mb-1">Matrícula</label>
            <input
              type="number"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Ex: 108"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="flex justify-between text-xs text-slate-400 pt-1">
            <Link href="/" className="hover:text-white">← Voltar</Link>
            <Link href="/forgot-password" className="hover:text-yellow-400">Esqueci a senha</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
