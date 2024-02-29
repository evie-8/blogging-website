import prismadb from "@/lib/prismadb"
import axios from "axios"

export const getBlogById = async (id: string) => {
    try {

        const blog = await prismadb.blog.findUnique({
            where: {
                id
            }
        })

        return blog
    } catch  {
        return null
        
    }
}




