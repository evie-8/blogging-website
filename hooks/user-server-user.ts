'use server';

import { auth } from "@/auth";

export const UseServer = async () => {
    
     const session = await auth();

     return session?.user
}