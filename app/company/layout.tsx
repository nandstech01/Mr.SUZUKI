import { Navbar } from '@/components/layout/Navbar'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="company" />
      <main>{children}</main>
    </div>
  )
}
