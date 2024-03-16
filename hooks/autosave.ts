import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EditContext } from "../components/editors/edit-page";

export const createBlog = async(data: any) => {
    try {
        const response = await axios.post("/api/blogs", data)

        return response.data

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateBlog = async (blogId: string, data: any) => {
        try {
            await axios.patch(`/api/blogs/${blogId}`, data)
        } catch (error) {
            console.log(error)
            throw error
        }

}

export const autosave = async () => {
    

    const {blog, blog: {title, banner, content, blogId, draft, des, tags}, setBlog,  saving, setSaving} = useContext(EditContext);

    
           if (title.length && banner.length && content) {
            try {
                if (!blogId) {
                    const newBlog = await createBlog({
                        title,
                        banner,
                        content,
                        draft,
                    });
                    setBlog({...blog, blogId: newBlog.id})
                  
        
                }   
                
                if (blogId){
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