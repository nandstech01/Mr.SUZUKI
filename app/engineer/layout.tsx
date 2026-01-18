import { Navbar } from '@/components/layout/Navbar'

export default function EngineerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 via-midnight-800 to-midnight-900">
      <Navbar variant="engineer" />
      <main className="relative">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="absolute inset-0 grid-pattern opacity-10" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
