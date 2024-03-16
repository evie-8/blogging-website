"use client"
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BlogWrapper } from './BlogPage'
import { themeContext } from '../ui/theme'
interface Props {
    action: string;
    index?: number;
    replyingToId?: string;
    setReply?: any
}

const CommentBox: React.FC<Props> = ({action, index, replyingToId, setReply})=>  {
    //@ts-ignore
    const {blog, blog: {id, actvity, activity: {totalComments, totalParentComments, totalLikes}, comments},setBlog, setParentCommentsLoaded} = useContext(BlogWrapper)
    
    const {theme} = useContext(themeContext)
    const  [commentMessage, setCommentMessage] = useState('')
   
    const {data: session} = useSession();

    const submitComment = async () => {
     
        if (!session || !session.user) {
            setCommentMessage('')
           
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
             commentedBy: session.user.id,
             replyingToId,
        }).then((response) => {
            setCommentMessage('')
          
            let newArray;

         
            if (replyingToId) {
                comments.results[index].children.push(response.data);
                response.data.childrenLevel =  comments.results[index].childrenLevel + 1
    
                response.data.parentIndex = index
                comments.results[index].isReplyLoaded = true;
                //@ts-ignore
                comments.results.splice(index + 1, 0, response.data)
                newArray = comments.results
               
                setReply(false)
                
            } else {
                response.data.childrenLevel = 0
                newArray = [response.data, ...comments.results]
                
            }
           
            let parentCommentInc = replyingToId ? 0 :  1;
            setBlog({...blog, comments: {...comments, results: newArray}, 
                activity: {totalLikes, totalComments: totalComments + 1, totalParentComments: totalParentComments + parentCommentInc, ...actvity}})       

            //@ts-ignore
            setParentCommentsLoaded(prev => prev + parentCommentInc)
            
           
        })
       
 
    }
    
    return (
   <>
    <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
    
    <textarea 
    className='input-box pl-4 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
    value={commentMessage} 
   
    onChange={(e) => setCommentMessage(e.target.value)} 
    placeholder='Leave a comment...'>
    </textarea>
    <button className='btn-dark mt-5 px-10' onClick={submitComment} >
        {action}
    </button>
   </>
  )
}

export default CommentBox 