import './globals.css'

export const metadata = {
  title: 'Coinwait',
  description: 'A Next.js system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  )
}

