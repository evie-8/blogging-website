"use client";

import { createContext, useEffect, useState } from "react";
import Editor from "./Editor";
import Publish from "./Publish";
import { useParams } from "next/navigation";
import Loader from "@/components/ui/Loader";
import axios from "axios";

interface BlogStruct {
  blogId: string;
    title: string;
    banner: string;
    des: string;
    draft: boolean;
    content: {
      blocks: string;
    };
    tags: string[];
    authorId: string;
    
  }
  
  export interface EditContextProps {
    blog: BlogStruct;
    setBlog: React.Dispatch<React.SetStateAction<BlogStruct>>;
    editState: string;
    setEditState: React.Dispatch<React.SetStateAction<string>>;
    textEditor: any,
    setTextEditor: React.Dispatch<React.SetStateAction<any>>;
    saving: string,
    setSaving: React.Dispatch<React.SetStateAction<any>>;
  }
  
  export const EditContext = createContext<EditContextProps>({} as EditContextProps);
  

const EditPublish = () => {

  const [loading, setLoading] = useState(true)
    const [editState, setEditState] = useState('editor');
    const [textEditor, setTextEditor] = useState('')
    const[saving, setSaving] = useState("")
    const [blog, setBlog] = useState<BlogStruct>({
        blogId: '',
        title: '',
        banner: '',
        des: '',
        draft: true,
        content: {
          blocks: ''
        },
        tags: [],
        authorId: '',
      });

      const params = useParams();
      let Id: string
     if (params.blogId) {
        Id = String(params.blogId)

     }
      const getBlog = async () => {
        if (Id) {
          try {
            const res = await axios.get(`/api/blogs/${Id}`)
            
            let tagNames = []
            if (res.data.tags) {
              //@ts-ignore
              tagNames = res.data.tags.map(tag => tag.name);
      
            }
            setBlog({...blog, blogId: res.data.id,
                        title: res.data.title, 
                        banner: res.data.banner,
                        des: res.data.des,
                        draft: res.data.draft,
                        content: res.data.content,
                        tags: tagNames,
                        authorId: res.data.authorId
      
            })
            setTextEditor(res.data.content.blocks)
            setLoading(false)
            
          } catch (error) {
            console.log(error)
            //@ts-ignore
            setBlog(null)
            setLoading(false)
          }
        } 
      }
      useEffect(() => {
      
        if (!Id || Id === undefined) {
          return setLoading(false)
        } else {
        getBlog()
        }
        
      }, [])
    //  console.log(loading)
    return (
        <>
       <EditContext.Provider value={{blog, setBlog, editState, setEditState, textEditor, setTextEditor, saving, setSaving}}>
       
        {loading ? <Loader/> :
        (
        
        editState === "editor" ?  (
            <Editor />
        ) : <Publish/> 
      )}
       
       </EditContext.Provider>
        
      
        </>
    )
}

export default EditPublish 