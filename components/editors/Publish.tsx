"use client"

import Animation from '@/components/ui/animation'
import React, { useContext, useTransition } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { EditContext } from './edit-page'
import Tag from './tag'
import { BeatLoader } from 'react-spinners'
import axios from 'axios'
import { useRouter} from "next-nprogress-bar";
import { themeContext } from '@/components/ui/theme'

function Publish() {
  const characterLimit = 200
  const tagLimit = 5
  const [loading, setLoading] = useTransition();
  const router = useRouter();
 
  const {blog, blog: {title, blogId, des, content, tags, banner}, setBlog, setEditState} = useContext(EditContext);

  const {theme} = useContext(themeContext);
  const handleClick = () => {
    setEditState("editor")
}

const KeyDown = (e: any) => {
  console.log(e);
  if (e.keyCode == 13) {
      e.preventDefault();
  }
}

  const changeTitle = (event: any) => {
      const input = event.target;
      setBlog({...blog, title: input.value})
  }

  const desChange = (event: any) => {
    const input = event.target;
    setBlog({...blog, des: input.value})
  }


  const tagDown = (event: any) => {
    if (event.keyCode == 13 || event.keyCode == 188) {
      event.preventDefault();
      const tag = event.target.value.toLowerCase();
      
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
              setBlog({...blog, tags: [...tags, tag]})
        }

      } else {
        toast.error(`You can add max ${tagLimit}`)
      }
      event.target.value = '';
    }
  }

  const onSubmit = () => {
    setLoading(async () => {

      try {
        if (!title) {
         toast.error("Title is required");
        
         return
      }
  
      if (!banner) {
          toast.error("Banner is required")
          
          return

      }
  
      if (!des || des.length > 200) {
        toast.error("Description is required")
      
        return
      }
      if (!tags || tags.length > 5) {
         toast.error("Atleast one tag required")
       
         return
      }
  
      if (!content.blocks.length) {
          toast.error("Content is required")
       
          return
      }
        await axios.patch(`/api/blogs/${blogId}`, {
          title,
          banner, 
          content, 
          des, 
          tags,
          draft: false,
          publishedAt: new Date()
        });
      
        toast.success("Blog Published");
        router.push("/dashboard/blogs", {}, {showProgressBar: true})
      } catch(error) {
        
          toast.error("Failed to publish blog");
          console.log('error', error)
      }
    }) 
  }
   return (
    <>
    <Animation>
   
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
      <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
        <button className='w-8 h-8 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleClick}>
          <i className='fi fi-rr-cross text-black'></i>
        </button>

        <div className='max-w-[550px] center'>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} />
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
        </div>
       

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input type="text"
          placeholder='Blog Title'
          defaultValue={title} className='input-box pl-4'
          onChange={changeTitle}/>
        
          <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
          <textarea className='h-40 resize-none leading-7 input-box pl-4'
          defaultValue={des} maxLength={characterLimit} onChange={desChange}
          onKeyDown={KeyDown}
          ></textarea>
          <p className='mt-1 text-dark-grey text-sm text-right'>{characterLimit - des?.length} characters left</p>
          
           <p className='text-dark-grey mb-2 mt-9'>
            Topics</p>
            <div className='relative input-box pl-2 py-2 pb-4'>
              <input type="text" placeholder='Topic' className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={tagDown}/>
              {
                tags.length ?
              
              tags.map((tag, i ) => (
                <Tag key={i}  index={i} tag={tag}/>
              ))
              : ''
              }
              </div> 
              <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit - tags.length} tags left</p>
            <button className='btn-dark px-8' onClick={onSubmit} disabled={loading}>{loading ? <BeatLoader/> : 'Publish'}</button>
        </div>
      </section>
    </Animation>
    </>
  )
} 

export default Publish