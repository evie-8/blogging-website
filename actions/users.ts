"use server"

import prismadb from "@/lib/prismadb"

export const fetchUserByUserName = async(userName: string) => {
    try {

        const user = await prismadb.user.findUnique({
            where: {
                username: userName
            },
            include: {
                comments: true,
                blogs: {
                    where: {
                        draft: false
                    }
                }
            }
        })
        
        return user
    } catch (error) {
        console.log(error)
        
    }
}

export const fetchBlogsByUserName = async (username?: string, page: number = 1, ) => {
    const limit = 1
    const skipper = (page -1) * limit
    let data = {}
    try {
  

        if (username) {
             const user = await fetchUserByUserName(username)
             const userId = user?.id

             const totalCount = await prismadb.blog.count({
                where: {
                    draft: false,
                    authorId: userId 
                }
            });
        
                const response = await prismadb.blog.findMany({
        
                    where: {
                        draft: false,
                        authorId: userId 
                    },
        
                  include: {
                    tags: true,
                    activity: true,
                    user: true
                    
                  },
        
                  orderBy: {
                    publishedAt: 'desc'
                  },
        
                  skip: skipper,
                  take: limit
                })
                data = { response: response, totalCount: totalCount }
       }

        return data
    } catch(error) {
        console.log(error)
        throw error
    }
  }