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

        //console.log('users', users)
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
  const limit = 1
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
          comments: {
          
            orderBy: {
              commentedAt: 'desc'
            },

            include: {
              commentor: true,
              children: true,
            }
          },
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
  console.log('tag-tag', tag)
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
    const limit = 2
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

     console.log(tags, newTag.length)
    return {tags, tagCount: newTag.length}
    
  } catch (error) 
  {
    console.log(error)  
  }
}