"use server";

import { auth } from "@/auth";
import { getResetPasswordTokenByToken } from "@/data/reset-password";
import { getUserByEmail } from "@/data/user";
import prismadb from "@/lib/prismadb";
import { NewPasswordSchema, ChangePasswordSchema } from "@/schemas/schema";
import { compare, hash } from "bcryptjs";
import * as z  from "zod";



export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {

    if (!token) {
        return {error: "Missing token!"}
    }

    const validateFields = NewPasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "invalid entries"}
    }

    const { password } = validateFields.data;

    const existingToken = await getResetPasswordTokenByToken(token);

    if (!existingToken) {
        return {error: "Invalid token!"}
    }

    const expired = new Date(existingToken.expires) < new Date();

    if (expired) {
        return {
            error: "Token has expired"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email);


    if (!existingUser) {
        return {error: "Email does not exist!"}
    }

    const oldPassword = existingUser.password

    if (oldPassword ) {
        const formerPassword = await compare(password, oldPassword);
        if (formerPassword) {
            return {error: "Create a new password"}
        }

    }
 
    const hashPassword = await hash(password, 10);
    await prismadb.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashPassword
        }
    })

    await prismadb.resetPasswordToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return {success: "Password updated!"}
} 

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {

const session = await auth()
    if (!session || !session.user) {
        return {error: 'No user session'}
    }

    const validateFields = ChangePasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "invalid entries"}
    }

    const { password, currentPassword } = validateFields.data;

  
    const existingUser = await getUserByEmail(session.user.email);


    if (!existingUser) {
        return {error: "Email does not exist!"}
    }

    const oldPassword = existingUser.password;

    if (oldPassword ) {
        const formerPassword = await compare(password, oldPassword);
       
        const similar   = await compare(currentPassword, oldPassword)
        if (!similar) {
            return {error: 'Invalid password'}
        }
        if (formerPassword) {
            return {error: "Create a new password"}
        }

    }
 
    const hashPassword = await hash(password, 10);
    await prismadb.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashPassword
        }
    })

  

    return {success: "Password updated!"}
} 