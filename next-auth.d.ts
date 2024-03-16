import { Role } from "@prisma/client"
import NextAuth, { type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: Role,
    username: string,
    image: string,
    isOAuth: boolean,
    bio: string,
    isTwoFactorEnabled : boolean,
    newNotification: boolean,
    socials: {
        youtube: string,
        instagram: string,
        facebook: string,
        twitter: string,
        github: string,
        website: string,
      }    
   
}

declare module "next-auth"  {
   interface Session {
    user: ExtendedUser
   }
}
