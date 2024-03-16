"use client"

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { getDay } from '@/date';
import NotificationCommentBox from './NotificationCommentBox';
import { $Enums } from '@prisma/client';
import axios from 'axios';
import { decrementCommentCounts } from '@/actions/comments';
import { useCurrentUser } from '@/hooks/use-current-user';

interface Props {
    notification: any;
    index: number;
    state: any;
}
const NotificationCard: React.FC<Props> = ({notification, index, state}) => {
  
  const [isReplying, setIsReplying] = useState(false);
  const {notifications, notifications: {results, totalBlogs}, setNotifications} = state
  const user = useCurrentUser()
  const handleClick = () => {
    setIsReplying((prev: boolean) => !prev)
  }

  const onDelete = async (id: string, type:$Enums.Notify, target:any) => {
        target.setAttribute("disabled", true)
        const num: any = await decrementCommentCounts(id)
        await axios.delete('/api/comments', {
            data: {
                commentId: id,
                blogId: notification.blogId,
                decrement: num,
            }}).then(() => {
                if (type === 'comment') {
                    results.splice(index, 1);
                } else {
                    delete results[index].replyComment;
                }
                target.removeAttribute("disabled");
                setNotifications({...notifications, results, totalBlogs: totalBlogs - 1, deleted: notifications.deleted + 1 })
            }).catch((error) => {
                console.log(error)
            })
        
  }
    return (
    <div className={`p-6 border-b border-grey border-l-black ${!notification.seen ? 'border-l-2' : ''} `} >
        <div className='flex gap-5 mb-3'>
            
            <Avatar className='w-14 h-14'>
                {
                    notification.userLiked.image ?
                    <AvatarImage src={notification.userLiked.image} className='rounded-full w-full h-full object-cover'/> :
                    <AvatarFallback className='text-white bg-black rounded-full flex items-center justify-center'>
                            {notification.userLiked.name.split(' ').map((name: string) => name[0]).join("")}
                    </AvatarFallback>
                }
            </Avatar>
            <div className='w-full'>
                    <h1 className='font-medium text-xl text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>
                            {notification.userLiked.name}
                        </span>
                        <Link href={`/user/${notification.userLiked.username}`} className='mx-1 text-black underline'>@{notification.userLiked.username}</Link>
                        <span className='font-normal'>
                            {notification.type === 'like' ? 'liked your blog' :
                            notification.type === 'comment' ? 'commented on' :
                            "replied on"}
                        </span>
                    </h1>

                    {
                        notification.type === 'reply' ? 
                        <div className='p-4 mt-4 rounded-md bg-grey'>
                            <p>{notification.replyOnCommentReply.comment}</p>
                        </div> :
                         <Link href={`/blog/${notification.blogId}`} className='font-medium text-dark-grey hover:underline line-clamp-1'>
                            {`"${notification.blog.title}"`}
                         </Link>
                    }
            </div>
        </div>

        {
            notification.type !== 'like' ? 
            <p className='ml-14 pl-5 font-gelasio text-xl my-5'>
                {notification.comment.comment}
            </p> : ''
        }
       
       <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
            <p>{getDay(notification.createdAt)}</p>
            {
                notification.type !== 'like' ? 
                <>
                <button onClick={handleClick} className='underline hover:text-black'>Reply</button>
                <button onClick={(event) =>onDelete(notification.commentId, 'comment', event.target )} className='underline hover:text-black'>Delete</button>
                </> : ''
            }
       </div>

       <div>
        {
            isReplying ? 
            <div className='mt-8'>
                <NotificationCommentBox blogId={notification.blogId} setReplying={setIsReplying}
               index={index} replyingToId={notification.commentId}
                notificationId={notification.id} notificationData={state}/>
            </div> : ''
        }

        {
            notification.replyComment  ?
            <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
                <div className='flex gap-3 mb-3'>
                    <Avatar className='w-8 h-8'>
                            {
                                user?.image ?
                                <AvatarImage src={user?.image} className='rounded-full w-full h-full object-cover'/> :
                                <AvatarFallback className='text-white text-xl bg-black rounded-full flex items-center justify-center'>
                                        {user?.name?.split(' ').map((name: string) => name[0]).join("")}
                                </AvatarFallback>
                            }
                     </Avatar>
                     <div>
                        <h1 className='font-medium text-xl text-dark-grey'>
                            <Link href={`/user/${user?.username}`} className='mx-1 text-black underline'>@{user?.username}</Link>
                            <span className='font-normal'> replied on</span>
                            <Link href={`/user/${notification.userLiked.username}`} className='mx-1 text-black underline'>@{notification.userLiked.username}</Link>
                        </h1>
                     </div>

                </div>
                <p className='ml-14 font-gelasio text-xl my-2'>{notification.replyComment.comment}</p>
                <button onClick={(event) =>onDelete(notification.replyComment.id, 'reply', event.target )} className='underline hover:text-black ml-14 mt-2'>Delete</button>
            </div> : ""
        }
       </div>
     </div>
  )
}

export default NotificationCard