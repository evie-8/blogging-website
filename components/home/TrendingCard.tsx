"use client"

import { getDay } from '@/date';
import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
interface Props {
    blog: any,
    index: number
}

const TrendingCard: React.FC<Props> =({blog, index}) => {

  return (
   <>
   {
    blog ? (
    <Link href={`/blog/${blog.id}`}  className='flex gap-5 mb-8'>
        <h1 className='blog-index'>{index < 10 ? '0' + (index + 1) : index}</h1>
            <div>
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
                    <p className="min-w-fit">{getDay(blog.publishedAt)}</p>

                </div>
                <h1 className="blog-title">{blog.title}</h1>
            </div>
    </Link>
    )
    :''
   }
   </>
  )
}

export default TrendingCard