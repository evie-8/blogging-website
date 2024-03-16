import React, { useContext, useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getDay, getFullDay } from '@/date'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import CommentBox from './CommentBox'
import { BlogWrapper } from './BlogPage'
import { decrementCommentCounts, getRepliesForCommentId } from '@/actions/comments'
import axios from 'axios'
import ShowMoreText from 'react-show-more-text'
import ReactTimeago from 'react-timeago'
interface Props {
    comment: any,
    index: number,
    leftValue: number
}

const CommentCard: React.FC<Props> = ({comment, index, leftValue}) => {
  const {data: session} = useSession()
  const [isReplying, setIsReplying] = useState(false)

  //@ts-ignore
  const {blog, blog: {comments, activity, activity: {totalComments, totalParentComments, totalLikes}}, setBlog, setParentCommentsLoaded} = useContext(BlogWrapper)
  const [loading, setLoading] = useTransition()
    const onClick = () => {
        if (!session || !session.user) {
            return toast("Login to post a comment", {
                icon:  '🔑'
            })
        }

        setIsReplying(prev => !prev)

  }

  

  const getParentIndex = () => {
    let start: any = index - 1;
    try {
        while (comments.results[start].childrenLevel >= comment.childrenLevel) {
         start--;   
        }
         return start;
    } catch {
        start = undefined;
        
    }
  }

  const removeCommentCards = (startingPoint: number, isDelete=false, decrease = 0)  => {
    if (comments.results[startingPoint]) {
        while (comments.results[startingPoint].childrenLevel > comment.childrenLevel) {
            comments.results.splice(startingPoint, 1);
            if (!comments.results[startingPoint]) {
                break;
            }
        }
    }

    if (isDelete) {
        let parentIndex = getParentIndex();

        if (parentIndex !== undefined) {
            comments.results[parentIndex].children = comments.results[parentIndex].children.filter((child: any) => child !== comment.id );
            if (!comment.results[parentIndex].children.length) {
                comments.results[parentIndex].isReplyLoaded = false;
            }
        }

         comments.results.splice(index, 1);

    }

    if (comment.childrenLevel === 0 && isDelete) {
        //@ts-ignore
        setParentCommentsLoaded(prev => prev-1)

    }

    setBlog({...blog, comments: {results: comments.results}, activity: {totalLikes, totalParentComments: totalParentComments - (comment.childrenLevel === 0 && isDelete ? 0 : 1 ), totalComments: totalComments - decrease}, ...activity})

  }

  const hideReplies = () => {
    comment.isReplyLoaded = false;
    removeCommentCards(index + 1)
  }

  const loadReplies = async (skip = 0, currentIndex = index ) => {
    if (comments.results[currentIndex].children) {
        hideReplies();

        await getRepliesForCommentId(comments.results[currentIndex].id, skip).then((replies: any) => {
            console.log('child', replies)
            comments.results[currentIndex].isReplyLoaded = true;
            for (let i = 0;i < replies?.length; i++) {
                replies[i].childrenLevel = comments.results[currentIndex].childrenLevel + 1;
                comments.results.splice(currentIndex + 1 + i + skip, 0, replies[i] )
            }

            setBlog({...blog, comments: {...comments, results: comments.results}})
           
        })

    }
    
  }

  const deleteComment = () => {
    setLoading(async () => {
        const num: any = await decrementCommentCounts(comment.id)
        console.log("decrease", num)
        await axios.delete('/api/comments', {
            data: {
                commentId: comment.id,
                blogId: comment.blogId,
                decrement: num
            }
        }).then(() => {
            removeCommentCards(index +1, true, num)
            

        })
        
    })
  }
  
  const LoadMoreReplies = () => {
    let parentIndex = getParentIndex();

    const loadMoreReplyButton =  <button onClick={() => loadReplies(index - parentIndex, parentIndex)} 
    className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
        More Replies
    </button>
    if (parentIndex !== undefined && comments.results[parentIndex] && comments.results[parentIndex].children) {
        if (comments.results[index + 1]) {
            if (comments.results[index + 1].childrenLevel < comments.results[index].childrenLevel) {
               if (index - parentIndex < comments.results[parentIndex].children.length) {
                return loadMoreReplyButton
               }
            }
        } else {
            if (parentIndex) {
                if (index - parentIndex < comments.results[parentIndex].children.length) {
                    return  loadMoreReplyButton
                   }
    
            }
        }

    }
   
  }
    return (
    <div className='w-full' style={{paddingLeft: `${leftValue * 2}px`}}>
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
                    <p className='font-semibold line-clamp-1'>
                        @{comment.commentor?.username}
                    </p>
                    <p className='min-w-fit ml-auto'>
                          <ReactTimeago date={comment.commentedAt} formatter={(value, unit, suffix) =>
                             {
                                if (value < 15 && unit ==='second' ) return 'just now';
                                if (unit == 'second')  return `few seconds ${suffix}`;
                                const plural:string  = value !== 1 ? 's' :''; 
                                return `${value} ${unit}${plural} ${suffix}`
                                
                              }
                            }
                              />
                    </p>
                </div>
                <p className='font-inter text-base ml-3'>
                        <ShowMoreText  lines={3}
                            more="read more"
                            less="show less"
                            anchorClass='text-dark-grey/50 italic hover:text-dark-grey cursor-pointer'
                            expanded={false}
                            truncatedEndingComponent={"... "} >
                             {comment.comment}
                        </ShowMoreText>
                </p> 
                <div className='flex gap-5 items-center mt-5'>

                    {
                        comment.isReplyLoaded && comment.children && comment.children.length ? 
                        <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={hideReplies}> 
                        <i className='fi fi-rr-comment-dots'></i>Hide Reply
                        </button> 
                        : 
                        comment.children && comment.children.length > 0 ?
                            <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={() => loadReplies()}> 
                            <i className='fi fi-rr-comment-dots'></i>
                            { comment.children.length === 1 ? `${comment.children.length} reply` : `${comment.children.length} replies` } 
                            </button>: ''
                        
                    }
                    <button className='underline' onClick={onClick}>
                        Reply
                    </button>
                    {
                        session?.user.id === comment.commentor.id || session?.user.id === comment.blog.authorId ?
                        <button onClick={deleteComment} disabled={loading}
                        className='p-2 px-3 rounded-full border border-transparent ml-auto hover:text-red  hover:bg-red/30 flex items-center'>
                            <i className='fi fi-rr-trash'></i>
                        </button> : ''
                    }
                     
                </div>

                {
                    isReplying ? 
                   <div className='mt-8'>
                         <CommentBox action='reply' index={index} replyingToId={comment.id} setReply={setIsReplying} />
                   </div>: ''
                }

            </div>
            <LoadMoreReplies/>
    </div>
  )
}

export default CommentCard