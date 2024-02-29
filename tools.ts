// @ts-ignore
import Embed from "@editorjs/embed"

// @ts-ignore
import List from "@editorjs/list"

// @ts-ignore
import Image from "@editorjs/image"

// @ts-ignore
import Header from "@editorjs/header"

// @ts-ignore
import Quote from "@editorjs/quote"

// @ts-ignore
import Marker from "@editorjs/marker"

// @ts-ignore
import InlineCode from "@editorjs/inline-code"


import axios from "axios"


const imageFile =  async (event: any) => {
    const form = new FormData();
    form.append('file', event);
    form.append('upload_preset', 'qayh85jr');
    let url = ""

    

    await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
    form).then(res => {
        if (res && res.data && res.data.secure_url) {
            url = res.data.secure_url
            console.log("texteditor", url)
        }
    })

    return {
        success: 1,
        file: { url }
    }
}

const imageUrl =   (event: any) => {
    let url = new Promise((resolve, reject) => {
        try {
            resolve(event)
        } catch (error) {
            reject(error)
        }
    })

    return  url.then(link => {
        return {
            success: 1,
            file: {url: link}
        }
    })
}
 
export const tools = {
    embed: Embed,
    
    list: {
        class: List,
        inlineToolbar: true,
    },
    image:{ 
        class: Image,
        config: {
            uploader: {
                uploadByUrl: imageUrl,
               uploadByFile: imageFile,
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: 'Type Heading ...',
            levels: [2,3],
            defaultLevel: 2
        }
    },
    quote: {
        class:  Quote,
        inlineToolbar: true,
    },
    marker : Marker,
    inlineCode: InlineCode,
  

}