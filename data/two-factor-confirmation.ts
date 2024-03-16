import prismadb from "@/lib/prismadb"

export const getTwoFactorConfirmById = async (userId: any) => {
    try {

        const tokens = await prismadb.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        })

        return tokens
    } catch  {
        return null
        
    }
}