"use client";
import { logout } from "@/actions/logout";
import Animation from "@/components/ui/animation"
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link"

const NavPanel = () => {
    const user = useCurrentUser();

    const onclick  = () => {
        logout();
    }
    return (
        <Animation 
        className="absolute right-0 z-50"
        transition={{duration: 0.2}} key="y">

            <div className="bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200">
                <Link href="/edit" className="flex gap-2 link md:hidden pl-8 py-4">
                <i className="fi fi-rr-file-edit"></i> 
                        <p>Write</p>
                </Link>

                <Link href={`/user/${user?.username}`} className="flex gap-2 link pl-8 py-4">
                <i className="fi fi-rr-user"></i><p>Profile</p>
                </Link>
                <Link href={`/dashboard/blogs`} className="flex gap-2 link pl-8 py-4">
                <i className="fi fi-rr-grid"></i><p>Dashboard</p>
                </Link>
                <Link href={`/settings/profile`} className="flex gap-2 link pl-8 py-4">
                <i className="fi fi-rr-settings"></i><p>Settings</p>
                </Link>
                <span className="absolute border-t border-grey w-[100%]"></span>
            
                <button className="text-left p-4 hover:bg-grey w-full flex gap-2 py-4 pl-8"
                  onClick={onclick}>
                        <i className="fi fi-rr-exit text-2xl my-auto "></i>
                        <div>  <h1 className="font-bold text-md ">Sign Out</h1>
                    <p className="text-dark-grey text-md">@{user?.username}</p></div>
                  
                </button>
            </div>
        </Animation>
    )
}

export default NavPanel