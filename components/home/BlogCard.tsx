"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import Link from "next/link";

import { readTime } from "@/readtime";
import ReactTimeAgo from "react-timeago"
interface Props {
    blog: any,

}

const BlogCard: React.FC<Props> = ({blog}) => {

  return (
    <div>
         {blog ? 
         (
           
      <Link href={`/blog/${blog.id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-5">

            <div className="w-full">
             <div className="flex gap-2 items-center mb-7">
       
                <Avatar className="w-6 h-6 ">
                {blog.user?.image ? 
                
                <AvatarImage src={blog.user?.image } className="w-full h-full object-cover rounded-full"/> :

                <AvatarFallback className="w-full h-full object-cover rounded-full bg-black text-white text-base">
                {blog.user?.name.split(" ")[0][0]}
                </AvatarFallback>
                }
                
                </Avatar> 
               <p className="line-clamp-1">{blog.user?.name} {`@${blog.user?.username}`}</p>
                <p className="min-w-fit"><ReactTimeAgo date={blog.publishedAt} formatter={(value, unit, suffix) =>
                             {
                                if (value < 15 && unit ==='second' ) return 'just now';
                                if (unit == 'second')  return  `few seconds ${suffix}`;
                                const plural:string  = value !== 1 ? 's' :''; 
                               return `${value} ${unit}${plural} ${suffix}`
                              }
                            }/></p>
    
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                 {blog.des}
            </p>
            <div className="flex gap-4 mt-7">
            {blog .tags.length > 0 &&
            <span className="btn-light py-1 px-4">{blog.tags[0].name}</span>}
            <span className='text-dark-grey py-1 px-4'>{readTime(blog.content.blocks).humanizedDuration} read</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
                <i className="fi fi-rr-heart text-xl mt-1"></i>
                {blog.activity.totalLikes}
            </span>
            </div>
            </div>
            <div className="h-28 aspect-square bg-grey">
                <img src={blog.banner} alt="banner"  className="w-full h-full aspect-square object-cover"/>
            </div>
      </Link>
         )
            :  ''           
        }
    </div>
       
  )
}

export default BlogCard