"use client"
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'


const SideNavBar = ({
    children,
  }: {
    children: React.ReactNode
  }) => {

    const [showSideNavBar, setShowSideNavBar] = useState(false)
    const path = usePathname();
    const [pageState, setPageState] = useState(path.split('/')[2].replace('-', ' '));

    const {data: session} = useSession()

    const activeLine = useRef<any>();
    const sideBarIcon = useRef<any>();
    const pageStateTab = useRef<any>();

    const changeStatePage = (event:any) => {
      let {offsetWidth, offsetLeft} = event.target;
      activeLine.current.style.width =offsetWidth + 'px';
      activeLine.current.style.left = offsetLeft + 'px';

      if (event.target === sideBarIcon.current) {
          setShowSideNavBar(true)
      } else {
        setShowSideNavBar(false)
      }

    }
   useEffect(()=> {
   setShowSideNavBar(false);
    pageStateTab.current.click()
   }, [pageState])
    
  return (
    <>
  <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
    <div className='sticky top-[80px] z-30'>
      <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
        <button ref={sideBarIcon} className='p-5 capitalize' onClick={changeStatePage}>
          <i className='fi fi-rr-grid pointer-events-none'></i>
        </button>
        <button className='p-5 capitalize' ref={pageStateTab} onClick={changeStatePage}>
          {pageState}
        </button>
        <hr className='absolute bottom-0 duration-500' ref={activeLine}/>
      </div>
        <div className={`min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:l-7 duration-500  ${!showSideNavBar ? 'max-sm:opacity-0 max-sm:pointer-events-none' : 'max-sm:opacity-100 pointer-events-auto'}`}>
            <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
            <hr className='border-grey -ml-6 mb-8 mr-6'/>
                <>
                        <Link href='/edit' className='sidebar-link hover:ml-1' onClick={(e: any) => setPageState(e.target.innerText)}>
                        <i className="fi fi-rr-file-edit"></i>
                            Write
                        </Link>
                        <Link href='/dashboard/notifications' className={`sidebar-link hover:ml-1 ${path === '/dashboard/notifications' ? 'active' : ''}`}onClick={(e: any) => setPageState(e.target.innerText)}>
                        
                        <button className='relative'>
                        <i className="fi fi-rr-bell"></i>
                          {
                            session?.user.newNotification ? 
                             <span className="absolute bg-red w-2 h-2 rounded-full z-5 top-0 left-2"></span> 
                             : ''
                           }
                        </button>
                        Notifications
                        </Link>
                        <Link href='/dashboard/blogs' className={`sidebar-link hover:ml-1 ${path === '/dashboard/blogs' ? 'active' : ''}`}onClick={(e:any) => setPageState(e.target.innerText)}>
                        <i className="fi fi-rr-document"></i>
                        Blogs
                        </Link>
                </>

                         <h1 className='text-xl text-dark-grey mt-12 mb-3'>Settings</h1>
                        < hr className='border-grey -ml-6 mb-8 mr-6'/>
                            <>
                                    <Link href='/settings/profile' className={`sidebar-link hover:ml-1 ${path === '/settings/profile' ? 'active' : ''}`} onClick={(e: any) => setPageState(e.target.innerText)}>
                                         <i className="fi fi-rr-user"></i>
                                         Edit  Profile
                                </Link>
                               {
                                !session?.user.isOAuth ? 
                                <Link href='/settings/change-password' className={`sidebar-link hover:ml-1 ${path === '/settings/change-password' ? 'active' : ''}`} onClick={(e: any) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-lock"></i>
                                    Change Password
                           </Link>
                           : ''
                               }
                            </>
        </div>
    </div>
    <div>
        {children}
    </div>
  </section>
 
  </>
  )
}

export default SideNavBar