import type { Metadata } from 'next'

import SideNavBar from '@/components/dashboard/SideNavBar'

export const metadata: Metadata = {
  title: 'EazyWrite Setttings',
  description: 'update-password-or-profile',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <>
     <SideNavBar>
      {children}
     </SideNavBar>
   
     </>
     
  )
}
