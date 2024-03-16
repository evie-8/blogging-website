import prismadb from "@/lib/prismadb"

export const hasNotifications = async (id: string) => {
    try {

        const result = await prismadb.notification.findMany({
            where: {
              
                  notificationForId: id,
                  seen: false,
                NOT: {
                    userLikedId: id
                }
              }
            
        })

      //console.log('noy', result)

        if (result.length) {
            return true;
        } 

        else {

            return false
        }
        
    } catch (error) {
        return null
    }
}