"use client";

import Link from "next/link";
import { useContext, useState, useTransition } from "react";
import NavPanel from "@/components/nav-panel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { EditContext } from "./edit-page";
import toast, { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { themeContext } from "@/components/ui/theme";
import axios from "axios";
import { useRouter} from "next-nprogress-bar";
import { ClipLoader } from "react-spinners";

interface NavBarProps {
    heading?: string;
    save?: string;
}

const NavBar:React.FC<NavBarProps> = ({
    heading,
    save
}) => {

    const user = useCurrentUser();
    const pathname = usePathname();
    const {theme, setTheme} = useContext(themeContext);
    const router = useRouter();
    const [navPanel, setNavPanel] = useState(false);
    const [loading, setLoading] = useTransition();

       
        const { blog: {title,blogId,  banner, content, draft, des,tags}, setEditState}  = useContext(EditContext);

        const handleBlur = () => {
            setTimeout(() => {
                setNavPanel(false)
            }, 2000)
        }


        const onSubmit = () => {
            setLoading(async () => {
        
              try {
                if (!title) {
                 toast.error("Title is required");
               
                 return
              }
          
              if (!banner) {
                  toast.error("Banner is required")
               
                  return
        
              }
          
              if (!des || des.length > 200) {
                toast.error("Description is required")
             
                return
              }
              if (!tags || tags.length > 5) {
                 toast.error("Atleast one tag required")
               
                 return
              }   
             
              if (!content.blocks.length) {
                  toast.error("Content is required")
               
                  return
              }
                await axios.patch(`/api/blogs/${blogId}`, {
                  title,
                  banner, 
                  content, 
                  des, 
                  tags,
                  draft: false,
                  isUpdated: true,
                
                });
               
                toast.success("Blog saved and new changes published");

                router.push("/dashboard/blogs", {}, {showProgressBar: true})
              } catch(error) {
                
                  toast.error("Failed to publish blog");
                  console.log('error', error)
              }
            }) 
          }

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

      
      const disable = title.length && banner.length && content.blocks ? false : true;

      
    return (
        
           <nav className="navbar">
                <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
      
                <Link href="/"  className="flex-none w-10">
                    <img src={`${theme === 'light' ? "/images/logo.png": '/images/logo-light.png'}`} className="w-full"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {heading} 
                   
                </p>
                <p className="text-dark-grey/40  w-full">
                        {save}
                    </p>
               
               
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                      {
                        pathname === '/edit' || draft === true ? <Button className="btn-dark py-2 rounded-full" onClick={handlePublish} disabled={disable}>Publish</Button>
                        : <Button className="btn-dark py-2 rounded-full" onClick={onSubmit} disabled={loading}>Save</Button>
                      }

                      
                        <button onClick={() => setTheme((prev: string) => prev === 'light' ? 'dark': 'light')} className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center">
                            <i className={`fi ${theme === 'light' ? ' fi-rr-moon-stars' : 'fi-rr-sun'} text-xl`}></i>
                        </button>
                          <Link href="/dashboard/notifications">
                              <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center hover:scale-105">
                                  <i className="fi fi-rr-bell  text-xl"></i>
                                  {
                                     user?.newNotification ?  <span className="absolute bg-red w-3 h-3 rounded-full z-5 top-2 right-3"></span> : ''
                                 }
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