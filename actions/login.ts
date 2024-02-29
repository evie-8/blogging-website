"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { SignInSchema } from "@/schemas/schema";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import * as z  from "zod";
import { getUserByEmail } from "@/data/user";
import { generateToken, generateTwoFactorToken } from "@/lib/token-generator";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/new-factor";

import prismadb from "@/lib/prismadb";
import { getTwoFactorConfirmById } from "@/data/two-factor-confirmation";
import { compare } from "bcryptjs";


export const Login = async (values: z.infer<typeof SignInSchema>) => {
    const validateFields = SignInSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid Entries"}
    }

   const {email, password, code} = validateFields.data;

   const existingUser = await getUserByEmail(email);
   if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!"}
   }

   if (!existingUser?.emailVerified) {

    const passwordMatch = await compare(password, existingUser.password);

    if (passwordMatch) {
        const token = await generateToken(existingUser.email);

    await sendVerificationEmail(token.email, token.token);
    return {success: "Confirmation email sent!"}
    }
    
    return {error: "Invalid password or email"}
   
   }


if (existingUser.isTwoFactorEnabled && existingUser.email) {

   if (code) {

    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

    if (!twoFactorToken) {
        return {error: "Invalid code!"}
    }

    if (twoFactorToken.token !== code) {
        return {error: "Invalid code!"}
    }

    const expired = new Date(twoFactorToken.expires) < new Date();
    if (expired) {
        return {error: "Code has expired"};
    }

    await prismadb.twoFactorToken.delete({
        where: {
            id: twoFactorToken.id
        }
    })

    const existingConfirm = await getTwoFactorConfirmById(existingUser.id);

    if (existingConfirm) {
        await prismadb.twoFactorConfirmation.delete({
            where: {
                id: existingConfirm.id,
            }
        })
    }

    await prismadb.twoFactorConfirmation.create({
        data: {
            userId: existingUser.id
        }
    })

   } 
   
   else {
   
    const twoFactorToken  = await generateTwoFactorToken(existingUser.email, password);

    console.log(twoFactorToken)
    if (!twoFactorToken) {
        return {error: "invalid email or password entered"}
    } else {
        await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

        return {twoFactor: true};
    }
   }
}



   try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    
   } catch (error) {
    if (error instanceof AuthError){
        switch (error.type) {
            case "CredentialsSignin" :
                    return {error: "Invalid email or password"}
        default: 
            return {error: "Something went Wrong!"}
        }
    } 
    throw error
    
   }
}