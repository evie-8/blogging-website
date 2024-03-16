import prismadb from "@/lib/prismadb"

export const getTwoFactorTokenByToken = async (token: string) => {
    try {

        const tokens = await prismadb.twoFactorToken.findUnique({
            where: {
                token
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}


export const getTwoFactorTokenByEmail = async (email: any) => {
    try {

        const tokens = await prismadb.twoFactorToken.findFirst({
            where: {
                email
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}