import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UNFPA DMP Dashboard | Digital Maternity Package',
  description: 'Digital Maternity Package Dashboard for UNFPA Mobile Health Clinics - Managing maternal healthcare in remote Ethiopia regions',
  keywords: ['UNFPA', 'maternal health', 'prenatal care', 'healthcare dashboard', 'Ethiopia', 'Nogob Zone'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-mesh-gradient">
        {children}
      </body>
    </html>
  )
}
