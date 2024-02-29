'use client'

import { fetchBlogsByUserName, fetchUserByUserName } from "@/actions/users"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Animation from "./ui/animation"
import Loader from "./ui/Loader"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { useSession } from "next-auth/react"
import AboutUser from "./AboutUser"
import PaginationData from "./home/PaginationData"
import BlogCard from "./home/BlogCard"
import Notify from "./home/Notfiy"
import LoadMore from "./home/LoadMore"
import PageNavigation from "./home/PageNavigation"

const ProfilePage = () => {
    const{data: session} = useSession();

    const params = useParams()
    const userName: string = String(params.userName);
    const [profile, setProfile] = useState<any>();
    const [blogs, setBlogs] = useState<any | null>(null)
    const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    const res = await fetchUserByUserName(userName)
   
    setProfile(res);
   
    setLoading(false)
  }

  const getBlogs = async (page = 1) => {
    const datas = await fetchBlogsByUserName(userName, page);
    //@ts-ignore
    const { response, totalCount } = datas;

    const newFormat = await PaginationData({array: blogs, data: response, page, count: totalCount})
   
    setBlogs(newFormat);
            
  }

  useEffect(() => {
     reset()
    getProfile()
    getBlogs()
  },[userName])

  const reset = () => {
    setProfile('')
    setBlogs(null)
    setLoading(true)
  }
 
    return (
    <Animation>
        
           { loading ? <Loader/> :
            
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:sticky md:top-[100px] md:py-10  border-grey">
                      
                      <Avatar className={ `w-48 h-48 md:w-32 md:h-32 `}>
                        {profile.image ? 
                         <AvatarImage src={profile.image} className=" w-full h-full object-cover rounded-full"/>
                         :
                        <AvatarFallback className=" w-full h-full text-center text-white bg-black rounded-full font-semibold text-4xl flex items-center justify-center">
                           
                           {profile.name.split(' ').map((n: string) => n[0]).join(' ')}
                        </AvatarFallback>
                        
                       
                        }
                        </Avatar>
                  
                        <h1 className="text-2xl font-medium">@{profile.username}</h1>
                        <p className="text-xl capitalize h-6">{profile.name}</p>
                        <p className="">{profile.totalBlogs.toLocaleString()} Blogs - {profile.totalReads.toLocaleString()} Reads</p>
                      
                          {
                          session && session.user.username === userName ? 
                          <div className="flex gap-4 mt-2"> 
                          <Link href='#' className='btn-light rounded-md'>Edit Profile</Link>
                          </div>
                          : ''
                          }
                           
                        
                        <AboutUser className='max-md:hidden' joinedAt={String(profile.createdAt)} 
                        socials=
                        {{
                          youtube: profile.youTube, twitter: profile.twitter,
                        github: profile.github,  facebook: profile.facebook,
                         instagram: profile.instagram, website: profile.website, 
                       
                        }}/>
                    </div>
                    <div className="max-md:mt-12 w-full md:overflow-y-auto">
                    <PageNavigation routes={[ "Blogs Published", "About"]} hiddenRoutes={['About']}>
                        <>
                        {blogs === null ? <Loader/> : 
                          (              

                            blogs.results.length ?
                            //@ts-ignore
                        blogs?.results.map((blog, i) => {
                          return <Animation  transition={{duration: 1, delay: i * .1}}>
                            <BlogCard blog={blog} />
                          </Animation>
                        }): <Notify message='No Blogs Published'/>)}
                        <LoadMore state={blogs} fetchData={getBlogs}/>
                        
                        </>
                        <AboutUser joinedAt={String(profile.createdAt)} 
                        socials=
                        {{
                          youtube: profile.youTube, twitter: profile.twitter,
                        github: profile.github,  facebook: profile.facebook,
                         instagram: profile.instagram, website: profile.website, 
                       
                        }}/>
            
                     </PageNavigation>

                    </div>

                </section>
                
             
                
                }
              
             
    </Animation>
  )
}

export default ProfilePage