import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppNav } from "@/components/app-nav"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const isAdmin = (session.user as any).isAdmin as boolean
  const nomeGuerra = (session.user as any).nomeGuerra as string

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNav isAdmin={isAdmin} nomeGuerra={nomeGuerra} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
