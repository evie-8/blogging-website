"use server"

import prismadb from "@/lib/prismadb"

export const findNotification = async (blogId: string, userLikedId: string) => {

    try {
        const find = await prismadb.notification.findFirst({
            where: {
                blogId,
                userLikedId,
                type: 'like'
    
            }
        })

        if (find) {
            //console.log(find, 'find')
            return true
        }
            return false

        
    } catch (error) {
        console.log(error)
        
    }
}