"use server"

import prismadb from "@/lib/prismadb"
import { $Enums } from "@prisma/client"

export const findNotification = async (blogId: string, userLikedId: string | undefined) => {

    try {
        const find = await prismadb.notification.findFirst({
            where: {
                blogId,
                userLikedId,
                type: 'like'
    
            }
        })

        if (find) {
          
            return true
        }
            return false

        
    } catch (error) {
        console.log(error)
        
    }
}

export const findNotificationByType = async (
    {filter, page = 1, limit = 5, deleted = 0, userId }: {
        filter?: $Enums.Notify,
        page?: number,
        limit?: number,
        deleted?: number,
        userId: string | undefined
    }
    ) => {
    try {

        
        let skipper = (page -  1) * limit;

        if (deleted) {
            skipper -= deleted;
        }
        
      let notifications:any[];
      let notificationCount: number;


      if (filter === 'all') {
        notifications = await prismadb.notification.findMany({
            where: {
                notificationForId: userId,
                NOT: {
                    userLikedId: userId
                }
            },
            include: {
                blog: true,
                userLiked: true,
                comment: true,
                replyOnCommentReply: true,
                replyComment: {
                    include: {
                        commentor: true,
                    }
                },

            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skipper,
            take: limit
            
        });
         notificationCount =await prismadb.notification.count({
            where: {
                notificationForId: userId,
                NOT: {
                    userLikedId: userId
                }
            }, 
        })
      } else {

        notifications = await prismadb.notification.findMany({
            where: {
                notificationForId: userId,
                
                NOT: {
                    userLikedId: userId
                },
                type: filter,
            },
            include: {
                blog: true,
                userLiked: true,
                comment: true,
                replyOnCommentReply: true,
                replyComment: {
                    include: {
                        commentor: true,
                    }
                },

            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skipper,
            take: limit
            
        });

       
         notificationCount =await prismadb.notification.count({
            where: {
                notificationForId: userId,
                NOT: {
                    userLikedId: userId
                },
                type: filter
            }, 
        })

      }

      await prismadb.notification.updateMany({
        where: {
            id: { in: notifications.map(notification => notification.id) }
        },
        data: {
            seen: true
        }
    });

        
         return {notifications: notifications, count: notificationCount}

        
    } catch (error) {
        return null
        
    }
}