import prismadb from "@/lib/prismadb"
import axios from "axios";

export const getUserByEmail = async (email: string) => {
   try {
    const user = await prismadb.user.findUnique({
        where: {
            email: email
        }
    })
    return user;
    
   } catch  {
    return null;
    
   }

   
}

export const getUserById = async (id: string) => {
    try {
        const user = await prismadb.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    
    } catch {
        return null;
        
    }
 
}

export const getTokenByEmail = async (email: string) => {
    try {

        const token = await prismadb.verificationToken.findFirst({
            where: {
                email
            }
        })

        return token
    } catch  {
        return null
        
    }
}

export const getToken = async (token: string) => {
    try {

        const tokens = await prismadb.verificationToken.findUnique({
            where: {
                token
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}


export const fetchUser = async (id: string) => {
    try {
        const response = await axios.get(`/api/users/${id}`)
        //console.log("user got", response.data)
        return response.data
       
    } catch(error) {
        console.log(error)
    }
}

