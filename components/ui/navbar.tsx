"use client";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import NavPanel from "../nav-panel";
import { usePathname} from "next/navigation";
import { useRouter} from "next-nprogress-bar";
import Image from "next/image";
import { noNavBarRoutes } from "@/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { themeContext } from "./theme";

const NavBar = () => {

    const{data: session} = useSession();
    const pathname = usePathname();
    const router = useRouter()
     const {theme, setTheme} = useContext(themeContext)

    const changeTheme = () => {
        setTheme((prev: string) => prev === 'light' ? 'dark': 'light')
      
    }

        const [visibility, setVisibility] = useState(false);
        const [navPanel, setNavPanel] = useState(false);

        const handleSearch = (event: any) => {
            const query = event.target.value;
           
            if (event.keyCode === 32) {
                event.preventDefault();
            }

            if (event.keyCode === 13 && query.length) {
               
                router.push(`/search/${query}`,{}, {showProgressBar: true})
            }
        }

        const handleBlur = () => {
            setTimeout(() => {
                setNavPanel(false)
            }, 2000)
        }

    
        if (noNavBarRoutes.includes(pathname)) {
            return (
                <nav className="navbar flex items-center justify-center border-0 gap-2 mt-2">

                 <Image src={`${theme === 'light' ? "/images/logo.png": '/images/logo-light.png'}`} width={50} height={50}  style={{width: "50px", height: "50px"}} alt="logo" />
                    
                 <h1 className="text-5xl font-gelasio text-center font-semi-bold ">EazyWrite</h1>
                </nav>
            )
        }

        if (pathname.startsWith('/edit')) {
            return null
        }


     
    return (
        <>
           <nav className="navbar">
                <Link href="/"  className="flex-none w-10">
                    <img src={`${theme === 'light' ? "/images/logo.png": '/images/logo-light.png'}`} alt='logo' className="w-full"/>
                </Link>
                <div className={"absolute py-4 px-[5vw] bg-white w-full left-0 top-full mt-0 border-b " + 
                 " border-grey md:block md:relative md:inset-0 md:border-0 md:p-0 md:w-auto md:show " + (visibility ? "show": "hide")}>
                 
                  <input type="text" onKeyDown={handleSearch} placeholder="Search ..." 
                    className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"/>
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 text-xl text-dark-grey -translate-y-1/2"></i>
                
                </div>
               
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button 
                    className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center hover:scale-105"
                    onClick={() => setVisibility(current => !current)}
                    >
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link href="/edit" className="hidden md:flex gap-2 link">
                        <i className="fi fi-rr-file-edit"></i> 
                        <p>Write</p>
                     
                    </Link>
                  
                        <button onClick={changeTheme} className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center">
                            <i className={`fi ${theme === 'light' ? ' fi-rr-moon-stars' : 'fi-rr-sun'} text-xl`}></i>
                        </button>
                  
                    { !session ? 
                  <>
                      <Link href="/auth/sign-in" className="btn-dark py-2">Sign In</Link>
                    <Link href="/auth/sign-up" className="btn-light py-2 md:block hidden">Sign Up</Link>
                  </>
                   :  <>
                    <Link href="/dashboard/notifications">
                        <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center hover:scale-105">
                            <i className="fi fi-rr-bell text-xl"></i>
                           {
                            session.user.newNotification ?  <span className="absolute bg-red w-3 h-3 rounded-full z-5 top-2 right-3"></span> : ''
                           }
                        </button>
                    </Link>
                    <div className="relative"  tabIndex={0} onBlur={handleBlur} onClick={() => setNavPanel(current => !current)}>
                        <Avatar className="w-12 h-12 mt-1 mb-1">
                            <AvatarImage   className="w-full h-full object-cover rounded-full" src={session.user.image}/>
                            <AvatarFallback className="w-full h-full object-cover rounded-full text-2xl text-center text-white bg-black capitalize">
                                {session.user.name?.split(" ")[0][0]}
                            </AvatarFallback>
                        </Avatar>
        
                            {navPanel ? <NavPanel/> : ""}
                    </div>
                   </>}
                    
                    </div>
                 
           </nav>
        </>
    )
}

export default NavBar; 