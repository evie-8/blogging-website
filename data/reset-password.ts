import prismadb from "@/lib/prismadb"

export const getResetPasswordTokenByToken = async (token: string) => {
    try {

        const tokens = await prismadb.resetPasswordToken.findUnique({
            where: {
                token
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}


export const getResetTokenByEmail = async (email: string) => {
    try {

        const tokens = await prismadb.resetPasswordToken.findFirst({
            where: {
                email
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}