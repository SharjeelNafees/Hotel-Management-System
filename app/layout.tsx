import './globals.css'
import 'react-datepicker/dist/react-datepicker.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Hotel Nova - Luxury Hotel Management System',
  description: 'Professional hotel management system with AI chatbot for seamless guest experience and efficient operations.',
  keywords: ['hotel', 'booking', 'luxury', 'management', 'chatbot', 'Nova'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
