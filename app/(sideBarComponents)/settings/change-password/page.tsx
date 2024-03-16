import { auth } from '@/auth'
import ChangePassword from '@/components/dashboard/changePassword'
import { notFound } from 'next/navigation';
import React from 'react'

const  PasswordChange =  async () => {

  const session = await auth();

  if (session?.user.isOAuth) {
    notFound()
  }
  return (
      <>
        <ChangePassword/>
      </>
  )
}

export default PasswordChange