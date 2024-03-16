"use client"
import { fetchBlogById,  fetchByTag } from '@/actions/blogs';

import { useParams } from 'next/navigation'
import React, { createContext, useEffect, useState } from 'react'
import Animation from '../ui/animation';
import Loader from '../ui/Loader';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { getFullDay } from '@/date';
import BlogInteraction from './BlogInteraction';
import BlogCard from '../home/BlogCard';
import 'react-quill/dist/quill.bubble.css';
import 'highlight.js/styles/stackoverflow-light.css';
import { readTime } from '@/readtime';
import CommentsWrapper, { getComments } from './CommentsWrapper';
import ReactTimeago from 'react-timeago';

export const BlogWrapper = createContext({});

const BlogPage = () =>  {

  const params = useParams();
  const blogId: string  = String(params.blogId); 
  const [blog, setBlog] = useState<any | null>(null);
  const [sameBlog, setSameBlog] = useState<any | null>(null);
  const [liked, setLiked] = useState(false) ;
  const [loading, setLoading] = useState(true);
  const [commentsContainer, setCommentsContainer] = useState(false);
  const [parentCommentsLoaded, setParentCommentsLoaded] = useState<number>(0);

  const getBlog = async () => {
     await fetchBlogById(blogId).then(async (blogData: any) => {
     
     await getComments({blogId, parentCountFunc:setParentCommentsLoaded}).then((comments) => {
    
      blogData.comments = comments;
   
     });
      
     setBlog(blogData);
      
      await fetchByTag(blogData.tags[0].name, blogId).then((matchingBlogs) => {
        setSameBlog(matchingBlogs);
      });
    
  
    
    });


    setLoading(false);
  }

  useEffect(() => {
    reset();
    getBlog();
  
  }, [blogId])

  const reset = () => {
    setBlog(null);
    setSameBlog(null);
    setLoading(true);
    setLiked(false);
   
    setParentCommentsLoaded(0);
 
  }
 
  return (
   
    <Animation>
      {
        loading ? <Loader/> :
       
      <BlogWrapper.Provider value={{blog, setBlog, liked, setLiked, commentsContainer, setCommentsContainer, parentCommentsLoaded, setParentCommentsLoaded}}>
          <CommentsWrapper />
          <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
          <img src={blog.banner} alt="banner" className='aspect-video' />

          <div className='mt-12'>
            <h2>
              {blog.title}
            </h2>

            <div className='flex max-sm:flex-col justify-between my-8'>
              <div className='flex gap-5 items-start'>
                <Avatar className={`w-12 h-12`}>
                  {
                    blog.user?.image ?
                  <AvatarImage src={blog.user?.image} className='w-full h-full object-cover rounded-full'/>
                  :
                  <AvatarFallback className='w-full h-full text-center text-xl  text-white font-semibold object-contain rounded-full bg-black flex items-center justify-center'>
                     {blog.user?.name.split(' ').map((n: string) => n[0]).join(' ')}
                  </AvatarFallback>
                  }
                </Avatar>

                <div className=''>
                  <Link href={`/user/${blog.user?.username}`} className='hover:underline capitalize'>
                  {blog.user?.name}
                    </Link>
                    {
                      blog.isUpdated && <span className='font-gelasio ml-3 pl-2'>Last Updated <ReactTimeago date={blog.updatedAt} formatter={(value, unit, suffix) =>
                        {
                           if (value < 15 && unit ==='second' ) return 'just now';
                           if (unit == 'second')  return `few seconds ${suffix}`;
                           const plural:string  = value !== 1 ? 's' :''; 
                           return `${value} ${unit}${plural} ${suffix}`
                           
                         }
                       }
                         /> </span>
                    }
                    <br />
                    <div className='flex items-start justify-start gap-3 font-gelasio flex-row'>
                    <span className='text-dark-grey'>{readTime(blog.content.blocks).humanizedDuration} read</span>
              
                    <span className='text-dark-grey'>
                      {getFullDay(blog.publishedAt)}
                    </span>
                    </div>
                 
                  <br />
                 
                </div>
              
              </div>
             
            </div>
          </div>
          <BlogInteraction/>

                  <div className='quill'>
                    <div className='ql-container ql-bubble'>
                          
                  <div className='my-12 ql-editor blog-page-content' id='blogPost' dangerouslySetInnerHTML={{__html:blog.content.blocks }}>  
                  </div>
                    </div>
                  </div>

            <BlogInteraction/>   
            {
              sameBlog !== null && sameBlog.length ?
              <>
                <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar Blogs</h1>
                {
                 
                sameBlog.map((same: any, i: number) => {
                    return<Animation key={i} transition={{duration: 1, delay: i *0.08}}>
                          <BlogCard blog={same}/>
                    </Animation>
                })
              }
              </>: ''

            }

        </div>
      </BlogWrapper.Provider>
      }
    </Animation>
  )
}

export default BlogPage