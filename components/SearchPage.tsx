'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PageNavigation from './home/PageNavigation';
import Loader from './ui/Loader';
import Animation from './ui/animation';
import BlogCard from './home/BlogCard';
import Notify from './home/Notfiy';
import LoadMore from './home/LoadMore';
import { fetchBlogs, fetchAllUsers } from '@/actions/blogs';
import PaginationData from './home/PaginationData';
import UserCard from './UserCard';
import axios from 'axios';

const total =  async(param?: string) => {
    try {
      let url = '/api/blogs';
      if (param) {
        url +=  `?search=${param}`
      }

      const res = await axios.get(url);
      return res.data.length
    } catch(error) {
      console.log(error)
    }
} 


const SearchPage = () => {

    const [blogs, setBlogs] = useState<any | null>(null)
    const [users, setUsers] = useState<any | null>(null)
  
    let params = useParams();

    const searchQuery: string = String(params.searchQuery)

    const searchBlogs = async (page = 1, createArray = false ) => {
        const res = await fetchBlogs(undefined, page, searchQuery)
   
        const totals = await total(searchQuery) 
        const newFormat = await PaginationData({ createArray, array: blogs, data: res, page, count: totals })
        setBlogs(newFormat)
      
    }

    const searchUsers = async () => {
        const res = await fetchAllUsers(searchQuery);
        setUsers(res)
    }

    useEffect(() => { 

        reset()
        searchBlogs(1, true)
       
        searchUsers() 
       


    }, [searchQuery]);

    const reset = () =>
    {
       setBlogs(null);
       setUsers(null);
       
    }


  return (
    <section className='h-cover flex justify-center gap-10'>
        <div className='w-full md:overflow-y-auto'>
            <PageNavigation routes={[`Search Results for "${searchQuery}"`,  'Accounts Matched']} hiddenRoutes={[ 'Accounts Matched']}>
            <>
            {blogs === null ? <Loader/> : 
                (              
                 
                  blogs.results.length ?
                 
              blogs?.results.map((blog: any, i: number) => {
                return <Animation key={i} transition={{duration: 1, delay: i * .1}}>
                  <BlogCard blog={blog} />
                </Animation>
              }): <Notify message='No Blogs Published'/>)}
              <LoadMore state={blogs} fetchData={searchBlogs} />
              </>
              <>
              {
            users === null ? <Loader/> : (
                users.length ? (
                  
                    users.map((user: any, i: number) => {
                        return <Animation key={i} transition={{duration: 1, delay: i * 0.08}}>
                                <UserCard user={user}/>
                        </Animation>
                    })
                ): <Notify message='No user found'/>
            )
        }
        </>
            </PageNavigation>
        </div>

        
        {/* large screens */}
        <div className='min-w-[40%] lg:min-w-[350px] border-l border-grey pl-8 pt-3 max-md:hidden sticky '>
        <div className='sticky top-[100px]'>
                <h1 className='font-medium text-xl mb-8'>
                    Users Related To Search
                    <i className='fi fi-rr-user mt-1 ml-2'></i>
                </h1>
                <>
                {
                    users === null ? <Loader/> : (
                        users.length ? (
                            
                            users.map((user: any, i: number) => {
                                return <Animation key={i} transition={{duration: 1, delay: i * 0.08}}>
                                        <UserCard user={user}/>
                                </Animation>
                            })
                        ): <Notify message='No user found'/>
                    )
                 }
        </>
        </div>
            </div>
             
    </section>
  )
}

export default SearchPage