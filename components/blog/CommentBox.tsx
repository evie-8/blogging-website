import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BlogWrapper } from './BlogPage'
interface Props {
    action: string
}

const CommentBox: React.FC<Props> = ({action})=>  {
    //@ts-ignore
    const {blog, blog: {id, comments, activity}, setBlog} = useContext(BlogWrapper)
    const  [commentMessage, setCommentMessage] = useState('')
   const {data: session} = useSession();

    const submitComment = async () => {
        if (!session || !session.user) {
            return toast("Login to post a comment", {
                icon:  '🔑'
            })
        }

        if (!commentMessage.length) {
            return toast.error("Write a comment")
        }

       await axios.post('/api/comments', {
            blogId: id,
             commentMessage, 
             commentedBy: session.user.id
        }).then((response) => {
            setCommentMessage('')
        })
       
 
    }
    return (
   <>
   <Toaster/>
    <textarea 
    className='input-box pl-4 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
    value={commentMessage} 
    
    onChange={(e) => setCommentMessage(e.target.value)} 
    placeholder='Leave a comment...'>
    </textarea>
    <button className='btn-dark mt-5 px-10' onClick={submitComment}>
        {action}
    </button>
   </>
  )
}

export default CommentBox 