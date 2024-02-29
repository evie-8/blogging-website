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
import 'highlight.js/styles/stackoverflow-light.css'
import { readTime } from '@/readtime';
import CommentsWrapper from './CommentsWrapper';

export const BlogWrapper = createContext({})

const BlogPage = () =>  {

  const params = useParams();
  const blogId: string  = String(params.blogId) 
  const [blog, setBlog] = useState<any | null>(null)
  const [sameBlog, setSameBlog] = useState<any | null>(null)
  const [liked, setLiked] = useState(false) 
  const [loading, setLoading] = useState(true)
  const [commentsContainer, setCommentsContainer] = useState(false) //set to false later
  const [parentComments, setParentComments] = useState(0)

  const getBlog = async () => {
    const blogData = await fetchBlogById(blogId)

    //@ts-ignore
    const matchingBlogs =await fetchByTag(blogData?.tags[0].name, blogId)
    setBlog(blogData)
    setSameBlog(matchingBlogs)
   
    setLoading(false)
  }

  useEffect(() => {
    reset()
    getBlog()
  
  }, [blogId])

  const reset = () => {
    setBlog(null);
    setSameBlog(null);
    setLoading(true);
    //setComments(false);
    setParentComments(0);
 
  }
  return (
   
    <Animation>
      {
        loading ? <Loader/> :
       
      <BlogWrapper.Provider value={{blog, setBlog, liked, setLiked, commentsContainer, setCommentsContainer, parentComments, setParentComments}}>
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

                <p className='capitalize'>
                  {blog.user?.name}
                  <br />
                  <Link href={`/user/${blog.user?.username}`} className='underline'>
                    {blog.user?.username}
                    </Link>
                </p>
                <span className='text-dark-grey'>{readTime(blog.content.blocks).humanizedDuration} read</span>
              
              </div>
              <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>
                Published on {getFullDay(blog.publishedAt)}
              </p>
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
                  //@ts-ignore
                sameBlog.map((same, i) => {
                    return<Animation transition={{duration: 1, delay: i *0.08}}>
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