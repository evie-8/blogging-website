import React, { useContext } from 'react'
import { BlogWrapper } from './BlogPage'
import CommentBox from './CommentBox'
import Notify from '../home/Notfiy'

import CommentCard from './CommentCard'
import Animation from '../ui/animation'
import { commentsByBlogId } from '@/actions/comments'

//@ts-ignore
export const getComments  = async ({skip = 0, blogId, array = null, parentCountFunc}) => {

let res;
  await commentsByBlogId(skip, blogId).then((data: any) => {
   
    data?.map((comment: any) => {
      comment.childrenLevel = 0
    })


    parentCountFunc((prev: any) => prev + data?.length)
    if (array === null) {
      res = {results: data}
    } else {
      res = {results: [... array, ...data]}
    }

  })

  return res
}

const  CommentsWrapper = () => {

    //@ts-ignore
    let  {blog, blog: {id, title, comments, activity},setBlog, commentsContainer, setCommentsContainer, parentCommentsLoaded , setParentCommentsLoaded} = useContext(BlogWrapper)

    const loadMoreComments = async () => {
      let newArray = await getComments({skip: parentCommentsLoaded, blogId: id, parentCountFunc: setParentCommentsLoaded, array: comments.results});
      setBlog({...blog, comments: newArray })
    }
  return (
    <div className={`max-sm:w-full fixed duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden  ${commentsContainer ? 'top-0 sm:right-[0]' : 'top-[100%] sm:right-[-100%]'}`} >
       
       <div className='relative'>
        <h1 className='text-xl font-medium'>Comments</h1>
        <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
            {title}
        </p>
        <button onClick={() =>
        //@ts-ignore
        setCommentsContainer(prev => !prev)}
         className='absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-grey'>
            <i className='fi fi-br-cross mt-1'></i>
        </button>

       </div>
       <hr className='border-grey my-8 w-[120%] -ml-10'/>

       <CommentBox action='Comment'/>

       {
          comments.results && comments.results.length ?  
            comments.results.map((comment: any, i: number) => {
              return <Animation>
                <CommentCard comment={comment} index={i} leftValue={comment.childrenLevel * 4}/>
              </Animation>
            })
          : <Notify message='No Comments'/>
        
       }

       {
        activity.totalParentComments > parentCommentsLoaded ? 
        <button onClick={loadMoreComments} className='text-dark-grey p-2 px-2 hover:bg-grey/30 rounded-md flex items-center gap-2'>Load More</button>
        :''

       }

    </div>
  )
}

export default CommentsWrapper