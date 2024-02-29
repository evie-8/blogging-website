import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST (req: Request) {

        try {
            const session = await auth();
            const body = await req.json();
        
            const {blogId, commentMessage, commentedBy} = body
        
            if (!session || !session.user) {
                return new NextResponse("Unauthenticated", {status: 401})
            }
        
            const authorId =  session?.user.id
        
            if (!authorId) {
                return new NextResponse("Invalid user session", { status: 401 });
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

            const comment = await prismadb.comment.create({
                data: {
                    blogId,
                    comment: commentMessage,
                    commentedAt: new Date(),
                    commentedBy
                },
              
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
                                    increment: 1
                                }
                            }
                        }
                    }
                })

                if (blog) {
                    await prismadb.notification.create({
                        data: {
                            type: 'comment',
                            notificationForId: blog.authorId,
                            userLikedId: commentedBy,
                            commentId: comment.id,
                            blogId
    
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