"use client"
import React, { useEffect, useState } from 'react'
import Animation from '../ui/animation'
import PageNavigation, { activeBtn } from './PageNavigation'

import Loader from '../ui/Loader'
import BlogCard from './BlogCard'

import TrendingCard from './TrendingCard'
import { BlogTrends,  fetchBlogs, fetchTags } from '@/actions/blogs'
import Notify from './Notfiy'
import PaginationData from './PaginationData'
import LoadMore from './LoadMore'
import axios from 'axios'

const total =  async(param?: string) => {
  try {
    let url = '/api/blogs';
    if (param) {
      url +=  `?q=${param}`
    }

    const res = await axios.get(url);
    return res.data.length
  } catch(error) {
    console.log(error)
  }
} 



const HomePage  =  () => {
  
  const [blogs, setBlogs] = useState<any | null>(null)
  const [trends, setTrends] = useState<any[] | null>(null)
  const [categories, setCategories] = useState<any | null>(null)
  const [pageState, setPageState] = useState("home")
  
//@ts-ignore
  const filterCategory = (event) => {
    const category = event.target.innerText.toLowerCase();
    setBlogs(null);

    if (pageState === category) {
      setPageState("home")
      return
    }
    setPageState(category)
  }

  const getTags = async(page = 1) => {
    const tagData = await fetchTags(page);
    
    //@ts-ignore
    const {tags, tagCount} = tagData
    const newFormat = await PaginationData({array: categories, data: tags, page, count: tagCount})
     
    setCategories(newFormat)
  
  }
  

  const filterCategories = async (page = 1) => {
    const res = await fetchBlogs(pageState, page)
    const totals = await total(pageState) 
   
    const newFormat = await PaginationData({array: blogs, data: res, page, count:totals})
    setBlogs(newFormat)
   
   }

  
  //@ts-ignore
  const fetchData = async (page = 1) => {

    const res = await fetchBlogs(undefined, page);

    const totals = await total() 
    const newFormat = await PaginationData({array: blogs, data: res, page, count: totals})
   
    setBlogs(newFormat);
        
  };

  const fetchTrending = async() => {
    
      const result = await BlogTrends()
     
      if (result) {
        setTrends(result)
      }

  }

  useEffect(() => {
    activeBtn.current.click();
   
    if (pageState === 'home') {
      fetchData()
    } else {
      filterCategories()
    }
    if (!trends) {
    fetchTrending()
    }

    if (!categories) {
      getTags()
    }
  }, [pageState]); 
  
  return (
  
  <Animation>
    <section className='h-cover flex justify-center gap-10'>
     
      {/* Latest blogs section*/}
        <div className='w-full md:overflow-y-auto'>
            <PageNavigation routes={[pageState, "trending blogs"]} hiddenRoutes={['trending blogs']}>
              <>
              {blogs === null ? <Loader/> : 
                (              

                  blogs.results.length ?
                  
              blogs?.results.map((blog: any, i: number) => {
                return <Animation  transition={{duration: 1, delay: i * .1}}>
                  <BlogCard blog={blog} />
                </Animation>
              }): <Notify message='No Blogs Published'/>)}
              <LoadMore state={blogs} fetchData={ pageState === 'home' ? fetchData : filterCategories}/>
              
              </>

              {/* Trending*/}

              {trends === null ? <Loader/> : 
              (
                trends.length ?
                trends.map((trend, i) => {
                  return <Animation transition={{duration: 1, delay: i * .1}}>
                      <TrendingCard blog={trend} index={i}/>
                  </Animation>
                }): <Notify message='No trending blogs'/>)
              }
            <>
            </>
            </PageNavigation>
        </div>

        {/* filters && Trending */}
        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden '>
          <div className='flex flex-col gap-10 sticky top-[100px]'>
              <div>
                  <h1 className='font-medium text-xl mb-8'>Stories from all interests</h1>
                  <div className='flex gap-3 flex-wrap'>
                    {
                      categories === null ? <Loader/> :
                      (
                        categories.results.length ?
                        //@ts-ignore
                    categories.results.map((category, i) => {
                      return <button onClick={filterCategory} className={`tag ` + (pageState === category?.name ? 'bg-black text-white ' : '')} key={i}>
                        {category?.name}
                      </button>
                    }) : <Notify message='No topics'/>
                   
                    )}
                   
                  </div>
                  <LoadMore state={categories} fetchData={getTags} />
              </div>

       
              <div>
                <h1 className='font-medium text-xl mb-8'>Trending <i className='fi fi-rr-arrow-trend-up'></i></h1>
                {trends === null ? <Loader/> : 
                (
                  trends.length ?
                    trends.map((trend, i) => {
                      return <Animation transition={{duration: 1, delay: i * .1}}>
                          <TrendingCard blog={trend} index={i}/>
                      </Animation>
                    }): <Notify message='No trending blogs'/>)
                  }
              </div>
          </div>
        </div>

    </section>
  </Animation>
  
  )
}

export default HomePage 