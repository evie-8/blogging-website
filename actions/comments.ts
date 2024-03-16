"use server"

import prismadb from "@/lib/prismadb"


export const commentsByBlogId = async (skipper: number, blogId: string) => {
    const limit = 5
    try {

        const comments = await prismadb.comment.findMany({
            where: {
                blogId,
                isReply: false
            },
            include: {
                children: true,
                commentor: true,
                blog: true
            },
            skip: skipper,
            take: limit,
            orderBy: {
                commentedAt: 'desc'
            }
            
        })
         
        return comments

    } catch(error) {
        console.log(error)
    }
}

export const  getRepliesForCommentId = async (id: string, skipper: number) => {
    const limit = 5;
    try 
    {

        const replies = await prismadb.comment.findUnique({
            select: {
                children: {
                    skip: skipper,
                    take: limit,
                    include: {
                        commentor: true,
                        children: true,
                        parent: true,
                        blog: true
                    },
                    orderBy: {
                        commentedAt: 'desc'
                    }
                }
                
            },
            where: {
                id: id
            },       
            
        })
      
        return replies?.children
        
    } catch (error) 
    {
        console.log(error)    
    }
} 


export const decrementCommentCounts = async (commentId: string) => {
    // Find the comment by ID
   try {
    const comment = await prismadb.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            children: true 
        }
    });

    if (!comment) {
        return null
    }

    let countToDecrement = 1; // Start with 1 for the current comment
    if (comment.children && comment.children.length > 0) {
        // If there are children, recursively calculate the total count
        for (const childComment of comment.children) {
            //@ts-ignore
            countToDecrement += await decrementCommentCounts(childComment.id);
        }
    } 

    return countToDecrement
   } catch (error) {
    console.log(error)
   }
}