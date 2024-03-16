"use client"
import { findAllBlogsByQuery } from '@/actions/blogs';
import { useCurrentUser } from '@/hooks/use-current-user';
import React, { useEffect, useState } from 'react'
import PaginationData from '../home/PaginationData';
import { Toaster } from 'react-hot-toast';
import PageNavigation from '../home/PageNavigation';
import Loader from '../ui/Loader';
import Notify from '../home/Notfiy';
import Animation from '../ui/animation';

import PublishedBlogsCard from './PublishedBlogs';
import DraftBlogsCard from './DraftBlogsCard';
import LoadMore from '../home/LoadMore';

const  BlogManagerCard =() => {
    const [blogs, setBlogs] = useState<any | null>(null);
    const [drafts, setDrafts] = useState<any | null>(null);
    const [query, setQuery] = useState('');
    const user = useCurrentUser()

    const getBlogs = async({page, draft, deleted=0}: {page: number, draft: boolean, deleted?: number}) => {
        await findAllBlogsByQuery({authorId: user?.id, page: page, draft: draft, deleted: deleted, query: query}).then(async (data: any) => {
            const newData = await PaginationData({array: draft? drafts: blogs, page, data: data?.blogs, count: data?.count});

            
            if (draft) {
                setDrafts(newData);
            } else {
                setBlogs(newData)
            }
        })
    }

    const handleSearch = (event: any) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);
        if (event.keyCode  == 13 && searchQuery.length)  {
            setBlogs(null);
            setDrafts(null);
        }

    }
    const handleChange = (event: any) => {
        if (!event.target.value.length) {
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }

    }

    useEffect(() => {
        if (blogs === null) {
                getBlogs({page: 1, draft: false})
        }

        if (drafts === null) {
            getBlogs({page: 1, draft: true})

        }
    }, 
    [blogs, drafts, query])
  return (
    <>
        <h1 className='max-md:hidden my-4 mx-2'>
            Manage Blogs
        </h1>
        <Toaster/>
        <div className='relative max-md:mt-5 md:mt-8 mb-10'>
            <input type="search" 
                className='w-full md:w-[65%] bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
                placeholder='Search blogs by title...'
                onChange={handleChange}
                onKeyDown={handleSearch}/>
            <i className='fi fi-rr-search absolute md:left-5 top-1/2 right-[10%] text-xl pl-1 md:pointer-events-none text-dark-grey -translate-y-1/2'></i>
        </div>
        <PageNavigation routes={['Published Blogs', 'Drafts ']}>
          {
            blogs === null ? <Loader/> :
            blogs.results.length  ? 
           <>
           {
            blogs.results.map((blog: any, i: number) => {
                return <Animation  key={i} transition={{delay: i * 0.04}}>
                       <PublishedBlogsCard blog={{...blog, index: i, setFunc: setBlogs}}/>
                </Animation>
            })
           }

           <LoadMore state={blogs} fetchData2={getBlogs} moreParams={{deleted: blogs.deleted, draft: false}}/> 
           </>
            : <Notify message='No Published Blogs'/>
          }

                

            {
                    drafts === null ? <Loader/> :
                    drafts.results.length  ? 
                <>
                {
                    drafts.results.map((blog: any, i: number) => {
                        return <Animation key={i} transition={{delay: i * 0.04}}>
                            <DraftBlogsCard blog={{...blog, index: i, setFunc: setDrafts }} />
                        </Animation>
                    })
                }
                  <LoadMore state={drafts} fetchData2={getBlogs} moreParams={{deleted: drafts.deleted, draft: true}}/> 
                </>
                    : <Notify message='No Drafts'/>
            }
        </PageNavigation>
    </>
  )
}

export default BlogManagerCard