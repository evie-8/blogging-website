import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST (req: Request) {

        try {
            const session = await auth();
            const body = await req.json();
        
            const {type, blogId, notificationForId, userLikedId, liked, activityId} = body
        
            if (!session || !session.user) {
                return new NextResponse("Unauthenticated", {status: 401})
            }
        
            const authorId =  session?.user.id
        
            if (!authorId) {
                return new NextResponse("Invalid user session", { status: 401 });
            }

            const increment = !liked ? 1 : -1

            await prismadb.activity.update({
                where: {
                    id: activityId,
                    blogId: blogId
                },
                data: {
                    totalLikes: {
                        increment: increment
                      }
                }
            })
            
            if (!liked) {
                await prismadb.notification.create({
                    data: {
                        type,
                        notificationForId,
                        blogId,
                        userLikedId
                    }
                })
               
            } else {
                await prismadb.notification.deleteMany({
                    where: {
                        userLikedId,
                        blogId,
                        type
                    }
                })
            }

            const blog = await prismadb.blog.findUnique({
                where: {
                    id: blogId
                }
            })
            return NextResponse.json(blog)

        } catch (error) {
        console.log('NOTIFICATION_POST', error);
        return new NextResponse("Internal Error", {status:500})
            
        }
}