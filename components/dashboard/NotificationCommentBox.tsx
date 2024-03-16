"use client"
import { useCurrentUser } from '@/hooks/use-current-user'
import axios from 'axios'
import React, { SetStateAction, useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { themeContext } from '../ui/theme'
interface Props {
   
    notificationData: any,
    notificationId: string,
    blogId: string,
    index?: number,
    replyingToId?: string,
    setReplying:  React.Dispatch<SetStateAction<boolean>>

}

const NotificationCommentBox: React.FC<Props> = (
    {
        notificationId,
        notificationData,
        blogId,
        index,
        replyingToId,
        setReplying

    }
) => {
    const  [commentMessage, setCommentMessage] = useState('')
    const {notifications, notifications: {results}, setNotifications} = notificationData
   
    const user = useCurrentUser()
    const {theme} = useContext(themeContext)
    const submitComment = async () => {

        if (!commentMessage.length) {
          
            return toast.error("Write a reply")
        }

       await axios.post('/api/comments', {
            blogId: blogId,
             commentMessage, 
             commentedBy: user?.id,
             replyingToId,
             notificationId
        }).then((response) => {
            console.log("res", response)
              setReplying(false);
            
              results[Number(index)].replyComment = {comment: response.data.comment, id: response.data.id}
              setNotifications({...notifications, results: results})      
        })
      
    }
    return (
        <>
         <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
    
         <textarea 
         className='input-box pl-4 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
         value={commentMessage} 
         onChange={(e) => setCommentMessage(e.target.value)} 
         placeholder='Leave a reply...'>
         </textarea>
         <button className='btn-dark mt-5 px-10' onClick={submitComment}>
             Reply
         </button>
        </>
       )
}

export default NotificationCommentBox