import { auth } from "@/auth"
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function GET(req: Request , {
    params
}: {params: {blogId: string}}) {

   
    try {

        const blog = await prismadb.blog.findUnique({
            where: {
                id: params.blogId
            },
            include: {
                tags: true,
                activity: true,
                comments: true,
                user: true
            }
        })

        return NextResponse.json(blog)

    } catch (error) {
        console.log("BLOG_GET", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export async function PATCH(req: Request,
    {params}: {params: {blogId: string}}) {

    try {

        const session = await auth();
        const body =  await req.json();

        const {title, banner, content,  des, tags, draft, publishedAt} = body

        if (!session || !session.user) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        const authorId = session.user.id;

      /*  if (!title) {
            return new NextResponse("Title is required", {status: 400})
        }
    
        if (!banner) {
            return new NextResponse("Banner is required", {status: 400})
        }
    
        if (!des || des.length > 200) {
            return new NextResponse("Description is required", {status: 400})
        }
        if (!tags || tags.length > 5) {
            return new NextResponse("Atleast one tag required", {status: 400})
        }
    
        if (!content.blocks.length) {
            return new NextResponse("Content is required", {status: 400})
        }
        
        */

        const author = await prismadb.user.findUnique({
            where: {
                id: authorId
            }
        });

        const blog = await prismadb.blog.findUnique({
            where: {
                id: params.blogId
            }});

           if (blog && author)  {
            if (blog.authorId === author.id) {
                console.log(blog.authorId === author.id)
                let updateBlog = await prismadb.blog.update({
                    where: {
                        id: params.blogId
                    },
                    data: {
                        title,
                        banner,
                        content,
                        des,
                        draft,
                        publishedAt
                    }
                });

                if (tags && tags.length > 0) {

                    updateBlog = await prismadb.blog.update({
                        where: {
                            id: params.blogId
                        },
                        data: {
                            title,
                            banner,
                            content,
                            des,
                            draft,
                            tags:  {deleteMany: {} }
                        }
                    });

                    updateBlog = await prismadb.blog.update({
                        where: {
                            id: params.blogId
                        },
                        data: {
                            tags: {
                                createMany: {
                                    data: tags.map((tag: string) => ({ name: tag }))
                                }
                            }
                        }
                    });
                }
                
                if (blog.draft !== draft) {
                    let increment = draft ? 0 : 1;
               
                        await prismadb.user.update({
                            where: {
                                id: authorId,
                            },
                            data: {
            
                                totalBlogs: {
                                    increment: increment
                                }
            
                            }
                        })

                }

                console.log("blogs",updateBlog)
                return NextResponse.json(updateBlog);
            }

           }

    } catch (error) {
        console.log("BLOG_PATCH", error)
        return new NextResponse("Internal Server Error", {status: 500}) 
    }
    
}