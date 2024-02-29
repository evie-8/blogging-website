import Link from 'next/link'
import React from 'react'

const ErrorPage = () => {
  return (
   <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
    <img src="/images/404.jpg" alt="Error" className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/>
    <h1 className='text-4xl font-gelasio leading-7'>Page not found</h1>
    <p className='text-dark-grey text-xl leading-7 -mt-8'>
        The page your looking for does not exist. Go back to <Link href='/' className='text-purple underline'> HomePage</Link>
    </p>
    <div className=' mt-auto flex gap-1'>
       
            <img src="/images/logo.png" alt="logo" 
            className='h-8 object-contain block mx-auto select-none' />
            <p className=' text-black text-xl font-gelasio font-bold'>EazyWrite</p>
    </div>
   

   </section>
  )
}

export default ErrorPage
