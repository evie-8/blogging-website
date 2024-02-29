import { fetchBlogById } from "@/actions/blogs"
import BlogPage from "@/components/blog/BlogPage"
import prismadb from "@/lib/prismadb"
import { notFound } from "next/navigation"

const Blog = async ({params}: {params: {blogId: string}}) => {

    const res = await prismadb.blog.findUnique({
        where: {
            id: params.blogId
        }
    })
    if (!res)
  {
    return notFound()
  }
    return (
        <BlogPage/>
    )
}

export default Blog