import { deleteBlog } from '@/actions/blogs';
import { getFullDay } from '@/date'
import Link from 'next/link'
import React, { useState } from 'react'
interface Props {
    blog: any,
 
}

const getSecondWord = (str: string) => {
  const words = str.split(/(?=[A-Z])/);
  return words.length > 1 ? words[1] : '';
};

const  PublishedBlogsCard: React.FC<Props> = ({blog}) => {
  const [showStat, setShowStat] = useState(false)
  
  const onDelete = async (blog: any, target: any) => {
    const {index, setFunc, id, authorId} = blog
    target.setAttribute("disabled", true);
    await deleteBlog({id, authorId}).then(() => {
        target.removeAttribute("disabled");
        setFunc((prev: any) => {
            let {deleted, totalBlogs, results} = prev
            results.splice(index, 1);
            if (!deleted) {
              deleted = 0
          }
            if (!results.length && totalBlogs - 1 > 0)   {
                return null
            }

            return {...prev, totalBlogs: totalBlogs - 1, deleted: deleted + 1}
        })
    })


}

  const BlogStats = ({stats}: {stats: any}) => {
    return (
      <div className='flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b'>
        {
          Object.keys(stats).map((key: any, i: any) => {
            return !key.includes("Parent") ? <div key={i} className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${i !== 0 ? 'border-grey border-l': ''}`}>
                    <h1 className='text-xl lg:text-2xl mb-2'>{stats[key].toLocaleString()}</h1>
                    <p className='capitalize max-lg:text-dark-grey'>{getSecondWord(key)}</p>
            </div>: ''
          })
        }

      </div>
    )
  }
  return (
    
    <>
      <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>

        <img src={blog.banner} alt="banner" className='max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover' />
        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
          <div>
            <Link href={`/blog/${blog.id}`} className='blog-title mb-4 hover:underline'>{blog.title}</Link>
            <p className='line-clamp-1'>Published on {getFullDay(blog.publishedAt)}</p>
          </div>
          <div className='flex gap-6 mt-3'>
            <Link href={`/edit/${blog.id}`} className='pr-4 py-2 underline'>Edit</Link>
           
           <button className='lg:hidden pr-4 py-2 underline' onClick={() => setShowStat((prev: boolean) => !prev)}>
              Stats
           </button>
           
            <button className='pr-4 py-2 underline text-red' onClick={(event: any) => onDelete(blog, event.target)}>
              Delete
            </button>
          </div>
        </div>
          <div className='max-lg:hidden'> 
          <BlogStats stats={blog.activity}/>

          </div>
      </div>
      {
        showStat ? <div className='lg:hidden'>
           <BlogStats stats={blog.activity}/>

        </div>: ''
      }
    </>
  )
}

export default PublishedBlogsCard