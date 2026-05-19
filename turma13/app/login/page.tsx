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
      setError("Matrícula ou senha incorretos.")
    } else {
      router.push("/turma13cfo2026/ranking")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Turma 13 CFO 2026</h1>
          <p className="text-sm text-gray-500 mt-1">APMP Paudalho · 1º Pelotão · 2ª CIA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              placeholder="Ex: 108"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center">
            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-blue-900">
              Esqueci minha senha
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
