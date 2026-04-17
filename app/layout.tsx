import "./globals.css"

export const metadata = {
  title: 'BOTA-GEN | Admin',
  description: 'Sistema de generación de códigos BOTA-NA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-black">{children}</body>
    </html>
  )
}
