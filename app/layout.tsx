import type { Metadata } from 'next'

import './globals.css'
import NavBar from '@/components/ui/navbar'
import SessionWrapper from '@/components/ui/session-wrapper'
import ProgressLoader from '@/components/ProgressBar'

export const metadata: Metadata = {
  title: 'EazyWrite',
  description: 'Blog Post App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang='en'>
        <body>
        <SessionWrapper>
       <ProgressLoader/>
        <NavBar/>
        {children}
        </SessionWrapper>  
        </body>
      </html>
     
  )
}
