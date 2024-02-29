import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function GET(req: Request , {
    params
}: {params: {userId: string}}) {

   
    try {

        const user = await prismadb.user.findUnique({
            where: {
                id: params.userId
            },
            include: {
                blogs: true
            }
        })

        return NextResponse.json(user)

    } catch (error) {
        console.log("USER_GET", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
