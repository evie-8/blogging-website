import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST (req: Request) {

        try {
            const session = await auth();
            const body = await req.json();
            
            const {blogId, commentMessage, commentedBy, replyingToId, notificationId} = body
        
            if (!session || !session.user) {
                return new NextResponse("Unauthenticated", {status: 401})
            }
        
         
            if (!blogId) {
                return  new NextResponse("Blog Id required", {status: 401})
            }
            if (!commentMessage) {
                return  new NextResponse("Comment is required", {status: 401})
            }

            if (!commentedBy) {
                return  new NextResponse("User who commented required", {status: 401})
            }

            let isReply = false;
            let parentId = null;

            if (replyingToId) {
                isReply = true;
                parentId = replyingToId
            }

            const comment = await prismadb.comment.create({
                data: {
                    blogId,
                    comment: commentMessage,
                    commentedAt: new Date(),
                    commentedBy,
                    isReply,
                    parentId
                },
                include: {
                    children: true,
                    commentor: true,
                    parent: true,
                    blog: true
                }
              
            })

            if (comment) {
            const blog = await prismadb.blog.update({
                    where: {
                        id: blogId
                    },
                    data: {
                        activity: {
                            update: {
                                totalComments: {
                                    increment: 1
                                },
                                totalParentComments: {
                                    increment: replyingToId ? 0 : 1
                                }
                            }
                        }
                    },
                   
                })

                if (blog) {
                     await prismadb.notification.create({
                        //@ts-ignore
                        data: {
                            type: replyingToId ? 'reply': 'comment',
                            notificationForId: replyingToId ? comment.parent?.commentedBy : blog?.authorId,
                            userLikedId: commentedBy,
                            commentId: comment.id,
                            blogId,
                            replyOnCommentReplyId: replyingToId ? replyingToId : null 
    
                        }
                    })
                }

                if (notificationId) {
                    await prismadb.notification.update({
                        where: {
                            id: notificationId
                        }, 
                        data: {
                            replyId: comment.id
                        }
                    })
                }

            }

            return NextResponse.json(comment)
            

        } catch (error) {
        console.log('COMMENT_POST', error);
        return new NextResponse("Internal Error", {status:500})
            
        }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth(); 
            const body = await req.json();
            
            const {commentId, blogId, decrement} = body
        
            if (!session || !session.user) {
                return new NextResponse("Unauthenticated", {status: 401})
            }

            let decrementValue: number;
             const comment = await prismadb.comment.findUnique({
                where: {
                    id: commentId
                },
                include: {
                    blog: true,
                    parent: true,
                    children: true,
                    Notification: true,
                    NotificationReplyComment: true
                }
            })

            if (!comment) {
                return new NextResponse("Comment not found", { status: 404 });
            }

            if (comment.commentedBy !== session.user.id && comment.blog.authorId !== session.user.id) {
                return new NextResponse("Unauthorized", { status: 403 });
            }

            await prismadb.comment.delete({
                where:  { 
                    id: commentId 
                },
                     
            });

            await prismadb.activity.update({
                where: { blogId },
                data: {
                    totalComments: { decrement: decrement },
                    totalParentComments: comment.parentId ? {decrement: 0} : { decrement: 1 }
                }
            });


            return new NextResponse("Comment deleted successfully", { status: 200 });
  

    } catch (error) {
        console.log('COMMENT_DELETE', error);
        return new NextResponse("Internal Error", {status:500})
        
    }
    
}