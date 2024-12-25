import './globals.css'

export const metadata = {
  title: 'Double Color Ball Lottery',
  description: 'A Next.js lottery system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  )
}

