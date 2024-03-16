import { auth } from "@/auth";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
    try {

        
        
        const users = await prismadb.user.findMany({
            select: {
                name: true,
                username: true,
                email: true,
            }
          

        });

        return NextResponse.json(users)
        
    } catch (error) {
        console.log('USERS_GET', error)
        return new NextResponse("Internal Error", {status: 500})
        
    }
}