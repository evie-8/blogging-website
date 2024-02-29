import React, { useContext, useEffect, useState } from 'react'
import { BlogWrapper } from './BlogPage'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { findNotification } from '@/actions/notify'
import toast from 'react-hot-toast'

const BlogInteraction = () => {

    const {data: session} = useSession()
    //@ts-ignore
    let {blog, blog: {id, title, activity, user}, setBlog, liked, setLiked,  setCommentsContainer} = useContext(BlogWrapper)


 const handleLike = async() => {
    if (session && session.user) {

        //@ts-ignore
        setLiked(p => !p)

        !liked ? activity.totalLikes++ : activity.totalLikes--
        setBlog({...blog, activity})
        console.log("liked", activity.totalLikes, liked)
        await axios.post("/api/notifications", {
          type: 'like',
          blogId: id,
          notificationForId: user.id,
          userLikedId: session.user.id,
          activityId: activity.id,
          liked
        })
    } else {
      return toast("Login to like a blog", {
        icon:  '🔑'
    })
    }
 }


 const [isPlaying, setIsPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [toSpeak, setToSpeak] = useState<any | null>(null);

  const play = () => {
    if (paused) {
      setPaused(false);
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.speak(toSpeak);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setPaused(true);
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (session && session.user) {
      const notifyExists = async() => {
        //@ts-ignore
        const result = await findNotification(id, session.user.id);
        //console.log('tt', result)
        setLiked(Boolean(result))
      }
      
      notifyExists()    
    }

  }, [])

  
  useEffect(() => {

    
    //@ts-ignore
    const blogPostContent = blog && document.getElementById('blogPost') && document.getElementById('blogPost').innerText;
    if (blogPostContent) {
        window.speechSynthesis.cancel();
      const speak = new SpeechSynthesisUtterance(blogPostContent);
      const voices = speechSynthesis.getVoices();
      speak.voice = voices[2];
      speak.onend = () => setIsPlaying(false);
      speak.onpause = () => setPaused(true);
      setToSpeak(speak);


      window.addEventListener('beforeunload', () => {
        window.speechSynthesis.cancel();
      });
    } else {
        setToSpeak(null);
      }

       return () => {
        window.addEventListener('beforeunload', () => {
            window.speechSynthesis.cancel();
          });
  };
  }, [blog]);

  

  return (
  
    <>
    <hr className='border-grey my-2'/>
    <div className='flex gap-6 justify-between'> 
         <div className='flex gap-3 items-center'>
         <button onClick={handleLike} className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? 'text-red bg-red/20': 'bg-grey/80'}` }>
                <i className={`fi ${liked ? 'fi-sr-heart' : 'fi-rr-heart'}`}></i>
            </button>
            <p className='text-xl, text-dark-grey' >{activity.totalLikes}</p>
         `
            
                <button onClick={
                  //@ts-ignore
                  () => setCommentsContainer(prev => !prev)} className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                    <i className='fi fi-rr-comment-dots'></i>
                </button>
                <p className='text-xl, text-dark-grey'>{activity.totalComments}</p>
            
        </div>
        <div className='flex gap-6 items-center'>

        <button className='' onClick={isPlaying ? pause : play}>
                    {isPlaying ? (
                    
                        <i className= "fi fi-rr-pause-circle text-xl"></i>
                
                    ) : (
                     
                        <i className="fi fi-rr-play-circle text-xl"></i>
                     
                    )
                        }
         </button> 

            {
                session && session.user && session.user.username === user.username ?
                <Link href={`/edit/${id}`} className='underline hover:text-purple'>Edit</Link>
                : ''
            }
            <Link href={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target='_blank'><i className='fi fi-brands-twitter text-xl hover:text-twitter'></i></Link>
        </div>
    </div>
    <hr className='border-grey my-2'/>
    </>
  )
}

export default BlogInteraction