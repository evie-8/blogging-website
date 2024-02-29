import crypto from "crypto"

import {v4 as uuid4} from "uuid";
import prismadb from "@/lib/prismadb";
import { getTokenByEmail, getUserByEmail } from "@/data/user";
import { getResetTokenByEmail } from "@/data/reset-password";
import { getTwoFactorTokenByEmail } from "@/data/new-factor";
import { compare } from "bcryptjs";


export const generateTwoFactorToken = async (email: string, password: string | null) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser  || !existingUser.password || !password) {
      return null
    }
      const comparePassword = await compare(password, existingUser.password);
  
      if (!comparePassword) {

        return null;
      }

      const existingToken = await getTwoFactorTokenByEmail(email);
  
      if (existingToken) {
        await prismadb.twoFactorToken.delete({
          where: {
            id: existingToken.id,
          },
        });
      }
  
      const twoFactorToken = await prismadb.twoFactorToken.create({
        data: {
          email,
          token,
          expires,
        },
      });
  
      return twoFactorToken;
    }



export const generateResetPaswordToken = async (email: string) => {
    const token = uuid4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getResetTokenByEmail(email);

    if (existingToken) {
        await prismadb.resetPasswordToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const newResetToken = await prismadb.resetPasswordToken.create({
        data: {
            email,
            expires,
            token
        }
    })
    return newResetToken;

}


export const generateToken = async (email: string) => {
    const token = uuid4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getTokenByEmail(email);

    if (existingToken) {
        await prismadb.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const newToken = await prismadb.verificationToken.create({
        data: {
            email,
            expires,
            token
        }
    })
    return newToken;

}