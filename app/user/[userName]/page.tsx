import { fetchUserByUserName } from '@/actions/users'
import ProfilePage from '@/components/ProfilePage'
import { notFound } from 'next/navigation'
import React from 'react'

const UserPage =  async ({params}: {params: {userName: string}}) => {
  const res = await fetchUserByUserName(params.userName)
  
  if (res === null || res === undefined)
  {
    return notFound()
  }

  return (
   <ProfilePage />
  )
}

export default UserPage