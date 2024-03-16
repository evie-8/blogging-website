import { deleteBlog } from '@/actions/blogs'
import Link from 'next/link'
import React from 'react'

interface Props {
    blog: any,
    
}
const DraftBlogsCard: React.FC<Props> = ({blog}) => {
  
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
  return (
    <div className='flex gap-5 lg:gap-10 border-b mb-6 border-grey'>
       <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{(blog.index + 1 ) < 10 ? '0' + (blog.index + 1): (blog.index + 1) }</h1>
       <div>
        <h1 className='blog-title mb-3'>
            {blog.title}
        </h1>
        <p className='line-clamp-2 font-gelasio'>{blog.des?.length ? blog.des : 'No Description'}</p>
        <div className='flex gap-6 mt-3'>
            <Link href={`/edit/${blog.id}`} className='pr-4 py-2 underline'>Edit</Link>
            <button onClick={(event: any) => onDelete(blog, event.target)} className='pr-4 py-2 underline text-red'>Delete</button>
        </div>
       </div>
    </div>
  )
}

export default DraftBlogsCard