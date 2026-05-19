import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Nav } from "@/components/nav"

export default async function LogadoLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--creme)" }}>
      <Nav isAdmin={(session.user as any).isAdmin} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
