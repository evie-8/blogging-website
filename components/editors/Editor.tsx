"use client";

import Animation from "@/components/ui/animation";
import { Label } from "@/components/ui/label";
import {Toaster} from "react-hot-toast"
import defaultPicLight from "@/public/images/blog-banner-light.png"
import defaultPicDark from "@/public/images/blog-banner-dark.png"
import axios from 'axios'
import { useCallback, useContext, useEffect, useRef} from "react";
import {toast} from "react-hot-toast"
import NavBar from "./navbar";
import { EditContext } from "./edit-page";
import Image from "next/image";
import 'react-quill/dist/quill.bubble.css';

import { createBlog, updateBlog } from "@/hooks/autosave";
import ReactQuill from 'react-quill';
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-light.css'
import { usePathname } from "next/navigation";
import { themeContext } from "@/components/ui/theme";


const syntax =  {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  }

const Editor = () => {
     const textRef = useRef<ReactQuill>(null)
    const pathname = usePathname()
   
    const {blog, blog: {title, banner, content, blogId, draft, des, tags}, textEditor, setTextEditor, setBlog,  saving, setSaving} = useContext(EditContext);
    const {theme} = useContext(themeContext)
    const autosave = async () => {


               if (title.length && banner.length && content.blocks) {
                try {
                    if (!blog.blogId) {
                        const newBlog = await createBlog({
                            title,
                            banner,
                            content,
                            draft,
                            tags,
                        });
                       
                        setBlog({...blog, blogId: newBlog.id})   
                      
            
                    } else {
                        const response= await axios.get(`/api/blogs/${blogId}`)
                         if (!response || !response.data || response.status !== 200) {
                            console.log("blog not found")
                        } else {
                            const blogData = response.data
                    
                            if (blogData.title !== title ||  blogData.banner !== banner|| blogData.content !== content) {
                                await updateBlog(blogId, {
                                    title,
                                    banner,
                                    content,
                                    draft,
                                    des,
                                    tags
                                });
                                console.log("blog updated")
                            }  else {
                                console.log('no changes')
                            }
                        }
                       
                        
                    }
                } catch (error) {
                    console.error("Error in handleSave:", error);
                    throw error;
                }
               }
            }

    useEffect(() => {
        const newUpdate = {...content, blocks: textEditor};
        setBlog({...blog, content: newUpdate})
       
           
     
    }, [textEditor])

      
    useEffect(() => {
        if (pathname !== '/edit'){  
            toast("All changes made will be automatically added to your published article")
        } else {
            return
        }
    }, [])
     
    const uploadBanner =  async (e: any) => {
        let image = e.target.files[0];
        if (image) {
            const loading = toast.loading("Uploading ...");
            
            const form = new FormData();
            form.append('file', image);
            form.append('upload_preset', 'qayh85jr');
        
            await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
            form)
                .then((result) =>
                {
                    if (result && result.data && result.data.secure_url) {
                        
                        setBlog({...blog, banner: result.data.secure_url})
                        toast.dismiss(loading);
                        toast.success("Banner loaded 🎉🎉");                  
                    }
                })
                .catch((error) => {
                    toast.dismiss(loading);
                    toast.error("Failed to upload banner 😔");
                   
                    console.log(error);
                });

     
        }
    }

    const KeyDown = (e: any) => {
        console.log(e);
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

   
    const handleTitle = async (e: any)=> {
        const input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + 'px';
        setBlog({...blog, title: input.value});
       
      
    }

    const handleBannerError = (e: any) => {
        const image = e.target;
        image.src = theme === 'light' ? defaultPicLight.src : defaultPicDark.src;
   
    }

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", 'qayh85jr');
        const result = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        formData);
        const url = result.data.secure_url   
        //console.log("url", url)
           
        return url
        }
       
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
              const file = input.files[0];
              const url = await uploadToCloudinary(file);
              const quill = textRef.current;
              if (quill) {
                const range = quill.getEditorSelection();
                range && quill.getEditor().insertEmbed(range.index, "image", url);
              }
            }
          };
      }, []);
  
    return (
        <>
        <NavBar save={saving.length ? saving : '' }  heading={title.length ? title: 'New Blog'}/>
        <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
        <Animation>
            <section>
                <div className="mx-auto max-w-[900px] w-full">
                    <div className="relative aspect-video bg-white border-4 border-grey rounded-lg hover:opacity-80">
                        <Label htmlFor="bannerUpload">
                            <Image src={banner} onError={handleBannerError} fill alt="banner" className="z-10 rounded-lg" />

                            <input id="bannerUpload" type="file" accept=".png, .jpg, .jpeg" hidden onChange={uploadBanner}/>
                        </Label>
                    </div>

                    <textarea  id="blogTitle" defaultValue={title} placeholder="Blog Title" 
                    className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
                    onKeyDown={KeyDown} onChange={handleTitle}
                    >

                    </textarea>

                    <hr className="w-full opacity-10 mb-5"/>
                    <div  className="font-gelasio" data-text-editor="name">
                    <ReactQuill id='textEditor' 
                    
                        ref={textRef} 
                        bounds={`[data-text-editor="name"]`}
                        onBlur={() => {autosave(); setSaving('Saved')}} 
                        onFocus={() => setSaving('Saving...')}  
                        modules={{
                            
                            toolbar: {
                            
                              container: [
                                [{ header: "2" }, { header: "3" }, { font: [] }],
                                [{ size: [] }],
                                ["bold", "italic", "underline", "strike", "blockquote"],
                                [
                                  { list: "ordered" },
                                  { list: "bullet" },
                                  { indent: "-1" },
                                  { indent: "+1" },
                                ],
                                ["link", "image", "video"],
                                ["code-block"],
                                ["clean"],
                              ],
                              handlers: {
                                image: imageHandler,  
                              },

                            },
                            syntax: syntax,
                         
                            clipboard: {
                              matchVisual: false,
                            },
                          }}
                          formats={
                            [
                            "header",
                            "font",
                            "size",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "list",
                            "bullet",
                            "indent",
                            "link",
                            "image",
                            "video",
                            "code-block",
                          ]}
                         
                        theme="bubble"
                        value={textEditor} 
                        onChange={setTextEditor}
                        placeholder="Write your story..." className='' />
                    </div>
                </div>
                
            </section>
        </Animation>
      
        </>
    )
}

export default Editor;