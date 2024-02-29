import React, { useContext } from 'react'
import { BlogWrapper } from './BlogPage'
import CommentBox from './CommentBox'
import Notify from '../home/Notfiy'

import CommentCard from './CommentCard'
import Animation from '../ui/animation'

const  CommentsWrapper = () => {

    //@ts-ignore
    let  {blog: {title, comments}, commentsContainer, setCommentsContainer} = useContext(BlogWrapper)

  return (
    <div tabIndex={0} onBlur={() => setCommentsContainer(false)} className={`max-sm:w-full fixed duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden  ${commentsContainer ? 'top-0 sm:right-[0]' : 'top-[100%] sm:right-[-100%]'}`} >
       
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
          comments && comments.length ?  
            comments.map((comment: any, i: any) => {
              return <Animation>
                <CommentCard comment={comment}/>
              </Animation>
            })
          : <Notify message='No Comments'/>
        
       }

    </div>
  )
}

export default CommentsWrapper