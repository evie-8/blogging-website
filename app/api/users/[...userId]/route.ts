import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request , {
    params
}: {params: {userId: string}}) {

   
    try {

        const user = await prismadb.user.findUnique({
            where:{
                username: params.userId[0]

            },
            include: {
                blogs: true
            }
        })

        const userByEmail = await prismadb.user.findUnique({
            where:{
                email: params.userId[1],


            },
            include: {
                blogs: true
            }
        })

        if (user && user.username === userByEmail?.username) {
            return NextResponse.json(true)
        } else if (user && user.username !== userByEmail?.username) {
            return NextResponse.json(false)
        }

        return NextResponse.json(true)


       


    } catch (error) {
        console.log("USER_GET", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
