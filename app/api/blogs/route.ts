import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { URL } from "url";

export async function POST (
    req: Request
) {

   try {
    const session = await auth();
    const body = await req.json();

    const {title, banner, content, des, tags, draft} = body;

    if (!session || !session.user) {
        return new NextResponse("Unauthenticated", {status: 401})
    }

    const authorId =  session?.user.id

    if (!authorId) {
        return new NextResponse("Invalid user session", { status: 401 });
    }

   /* if (!title) {
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
    const blogData = {
        title,
        banner,
        des,
        content,
        authorId,
        draft,
    };

    if (tags && tags.length > 0) {
        // Include tags creation only when the tags array is non-empty
        //@ts-ignore
        blogData.tags = {
            createMany: {
                data: tags.map((tag: string) => ({ name: tag })),
            },
        };
    }

    const blog = await prismadb.blog.create({
        data: blogData
    });

    let increment = draft ? 0 : 1

    console.log(increment)
    if (blog) {

        await prismadb.activity.create({
            data: {
                totalLikes: 0,
                totalComments: 0,
                totalReads: 0,
                totalParentComments: 0,
                blogId: blog.id,
            },
        });

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
            console.log("blogs",blog)
    };
    
    return NextResponse.json(blog)

    
   } catch (error) {
    console.log('[BLOG_POST]', error)
    return new NextResponse("Internal Error", {status:500})
   }
}


export async function GET (req: Request) {
    try {

        const url = new URL(req.url);
        
        const tag = url.searchParams.get('q')
        const search = url.searchParams.get('search')

 
        let whereCondition: any = {
            draft: false,
          };

        if (tag) {
      whereCondition = {
          tags: {
              some: {
                  name: tag,
              },
          },
          draft: false,
      };
  }  if (search) {
      whereCondition = {
          title: {
              contains: search,
          },
          draft: false,
      };
  }
        //console.log("tag", tag)
        //console.log('search', search)
        const blogs = await prismadb.blog.findMany({
            where:whereCondition,
            include: {
                tags: true,
                activity: true,
                user: true
            },
            orderBy: {
                publishedAt: 'desc'
            },
            
        });

        console.log('...', blogs)
        return NextResponse.json(blogs)
        
    } catch (error) {
        console.log('BLOGS_GET', error)
        return new NextResponse("Internal Error", {status: 500})
        
    }
}