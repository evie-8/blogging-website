import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismadb from "./lib/prismadb"
import { getUserById } from "./data/user"
import { Role } from "@prisma/client"
import { getTwoFactorConfirmById } from "./data/two-factor-confirmation"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/sign-in",
        error: "/auth/error"
    },
    events: {
        async linkAccount({user}) {
            
            await prismadb.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    emailVerified: new Date,
                    username: user.email?.split("@")[0]
                }
            })
        }
    },
    callbacks: {

        async signIn({user, account}) {
            if (account?.provider !== "credentials") {
                    return true
            }
            const existsUser = await getUserById(user.id);
            if (!existsUser?.emailVerified) return false;

            if (existsUser.isTwoFactorEnabled) {
                const twoFactorConfirm = await getTwoFactorConfirmById(existsUser.id);

                if (!twoFactorConfirm) return false;

                await prismadb.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirm.id
                    }
                })
            }

            return true

        },

        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
             if (token.role && session.user) {
                session.user.role = token.role as Role;
             }
             if (token.picture && session.user) {
                session.user.image = token.picture
             }
             if (token.username && session.user) {
                session.user.username = token.username as string ;
             } 
            return session
        },
        async jwt({token}) {
            if (!token.sub) return token;
            const existsUser = await getUserById(token.sub);
            token.role = existsUser?.role;
            token.username = existsUser?.username;
            token.picture = existsUser?.image
            
            return token
        },
    },
    adapter: PrismaAdapter(prismadb),
    session: {strategy: "jwt"},
  ...authConfig,
})    