import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getDay } from '@/date'
interface Props {
    comment: any
}

const CommentCard: React.FC<Props> = ({comment}) => {
  return (
    <div className='w-full'>
            <div className='my-5 p-6 rounded-md border border-grey'>
                <div className='flex gap-3 items-center mb-8'>
                    <Avatar className='w-6 h-6'>
                        {
                            comment.commentor?.image ? 
                            <AvatarImage src={comment.commentor?.image} className='w-full h-full object-cover rounded-full'/>
                            :
                            <AvatarFallback className=' text-white bg-black w-full h-full rounded-full font-bold whitespace-nowrap'>
                                      <p>{comment.commentor?.name.split(" ")[0][0]}</p>
                            </AvatarFallback>
                        }
                    </Avatar>
                    <p className='line-clamp-1'>
                        {comment.commentor?.name} @{comment.commentor?.username}
                    </p>
                    <p className='min-w-fit'>
                            {getDay((comment.commentedAt))}
                    </p>
                </div>
                <p className='font-gelasio text-xl ml-3'>
                         {comment.comment}
                    </p>
            </div>
    </div>
  )
}

export default CommentCard