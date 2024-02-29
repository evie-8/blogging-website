"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import NavPanel from "@/components/nav-panel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { EditContext } from "./edit-page";
import toast from "react-hot-toast";


interface NavBarProps {
    heading?: string;
    save?: string;
}

const NavBar:React.FC<NavBarProps> = ({
    heading,
    save
}) => {

    const user = useCurrentUser();
     
        const [navPanel, setNavPanel] = useState(false);

        const handleBlur = () => {
            setTimeout(() => {
                setNavPanel(false)
            }, 2000)
        }

        const {blog, blog: {title, banner, content}, setBlog, textEditor, setEditState}  = useContext(EditContext);

        const handlePublish = () => {
            if (!banner.length) {
                return toast.error("Blog banner is not loaded")
            }

            if (!title.length) {
                return toast.error("A blog should have a title")
            }

            if (!content.blocks) {
               
                return  toast.error("You haven't written anything")
             
            }
            setEditState("publish")
        }


        //@ts-ignore
        const disable = title.length && banner.length && content.blocks ? false : true
      
    return (
        
           <nav className="navbar">
                <Link href="/"  className="flex-none w-10">
                    <img src="/images/logo.png" className="w-full"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {heading} 
                   
                </p>
                <p className="text-dark-grey/40  w-full">
                        {save}
                    </p>
               
               
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                      <Button className="btn-dark py-2 rounded-full" onClick={handlePublish} disabled={disable}>Publish</Button>
                      <button className=""><i className="fi fi-rr-menu-dots font-semibold text-2xl"></i></button>
                  
                    
                          <Link href="/dashboard/notifications">
                              <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center hover:scale-105">
                                  <i className="fi fi-rr-bell  text-xl"></i>
                              </button>
                          </Link>
                    <div className="relative" tabIndex={0} onBlur={ handleBlur} onClick={() => setNavPanel(current => !current)}>
                        <Avatar className="w-12 h-12 mt-1 mb-1" >
                            <AvatarImage   className="w-full h-full object-cover rounded-full" src={user?.image}/>
                            <AvatarFallback className="w-full h-full object-cover rounded-full text-2xl text-center text-white bg-black capitalize">
                                {user?.name?.split(" ")[0][0]}
                            </AvatarFallback>
                        </Avatar>
        
                            {navPanel ? <NavPanel/> : ""}
                    </div>
                   
                    
                    </div>
                 
           </nav>
      
    )
}

export default NavBar; 