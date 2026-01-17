import { Navbar } from '@/components/layout/Navbar'

export default function EngineerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="engineer" />
      <main>{children}</main>
    </div>
  )
}
