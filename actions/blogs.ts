"use server"

import prismadb from "@/lib/prismadb";

export const fetchAllUsers = async(query?: string) => {
    try {
        const users = await prismadb.user.findMany({
            where : {
               OR: [
                {
                username: {
                    contains: query
                },
                
            },
            {
                name: {
                    contains: query
                }
            }
               ]
            },

            include: {
                comments: true
            },
            take: 5
        })

        return users
    } catch(error) {
        console.log(error)
    }

}

export const BlogTrends = async() => {
    try {
        const result = await prismadb.blog.findMany({
            where: {
              draft: false
            },
            orderBy:  [
              {
              activity: {
                totalLikes: 'desc',
               
              }

              },
              {
                activity: {
                  totalReads: 'desc',
                 
                }
  
                },
                {
                  publishedAt: 'desc'
                }
            ]
            ,
            take: 5,
            include: {
                tags: true,
                activity: true,
                user: true
            }
          });
         // console.log(result)
          return result
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const fetchBlogs = async (tag?: string, page: number = 1, search?: string) => {
  const limit = 5
  const skipper = (page -1) * limit
  try {

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
      const response = await prismadb.blog.findMany({
        where: whereCondition,
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
     
      return response
      //console.log("tttt", response)
  } catch(error) {
      console.log(error)
      throw error
  }
}


export const fetchBlogById = async ( blogId?: string) => {
  try {

      const blog = await prismadb.blog.update({
      
        include: {
          tags: true,
          activity: true,
          user: true

        },

        where: {
          id: blogId
        },

        data: {
          activity: {
            update: {
              totalReads: {
                increment: 1
              }
            }
          },

          user: {
            update: {

              totalReads: {
                increment: 1
              }
            }
          }
        },
      
      })
    
  return blog
    
  } catch (error) {
    console.log(error)
    
  }
}


export const fetchByTag = async(tag: string, blogId: string) => {
  //console.log('tag-tag', tag)
  try {
    const blogs = await prismadb.blog.findMany({
      where: {
        draft: false,
        AND: [
          {
            tags: {
              some: {
                name: tag
              }
            }
          },
          {
            NOT: {
              id: blogId
            }
          }
        ]   
      },
      
      include: {
        tags: true,
        activity: true,
        user: true,
        
      },

      orderBy: {
        publishedAt: 'desc'
      },
      take: 6
  });

  return blogs
  } catch(error) {
    console.log(error)
  }
}


export const fetchTags = async (page: number = 1) => {
  try {
    const limit = 6
    const skipper = (page -1) * limit
    const tags = await prismadb.tag.findMany({
     distinct: ['name'],

     select: {
      name: true
     },
     skip: skipper,
     take: limit
    })
    if (!tags) {
      return null
    }

    const newTag = await prismadb.tag.findMany({
      distinct: ['name'],
 
      select: {
       name: true
      },
      
     })

     //console.log(tags, newTag.length)
    return {tags, tagCount: newTag.length}
    
  } catch (error) 
  {
    console.log(error)  
  }
}


export const findAllBlogsByQuery = async(
  {authorId, draft, query, page, deleted}: 
  {authorId: string | undefined, draft: boolean, query: string, page: number, deleted?: number}) => {
try {
    const limit = 5;
    let skipper = (page -1 ) * limit;

    if (deleted) {
      skipper -= deleted
    }

    let whereClause:any = {
      draft: draft,
      authorId: authorId
    };

    if (query) {
      whereClause = {
        title: {
          contains: query
        },
        draft: draft,
        authorId: authorId,
      }
    }

    const blogs = await prismadb.blog.findMany({
      where:whereClause,
      take: limit,
      skip: skipper,
      orderBy: draft ? {
        createdAt: 'desc'
      }: { publishedAt: 'desc'},
      include: {
        activity: {
          select: {
            totalComments: true,
            totalLikes: true,
            totalParentComments: true,
            totalReads: true
          }
        },
        user: true
      }
    });
    const blogsCount = await prismadb.blog.count({
      where: whereClause
    })

    //console.log('blogs', blogs, blogsCount)
    return {blogs:blogs, count: blogsCount}

} catch (error) {
 return null 
}
}


export const deleteBlog = async({id, authorId}: {id:string, authorId: string}) => {
  try {

    const blog = await prismadb.blog.findUnique({
      where:{
        id,
        authorId
      },
      include: {
        activity: true
      }

    })
    if (blog) {
      let del = blog.draft === false ? 1: 0 
      let reads = blog.activity?.totalReads
    await prismadb.blog.delete({
      where: {
        id,
        authorId
      }
    })

  
    await prismadb.user.update({
      where: {
        id: authorId
      },
      data: {
        totalBlogs: {
          decrement: del
        },
        totalReads: {
          decrement: reads
        }
      }
    })
  }
   
  return 'deleted successfully '
  } catch (error) {
    return null;
    
  }
}