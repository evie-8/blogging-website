"use server";

import {hash} from "bcryptjs";

import { RegisterSchema } from "@/schemas/schema";
import * as z  from "zod";
import prismadb from "@/lib/prismadb";
import { getUserByEmail } from "@/data/user";
import { generateToken } from "@/lib/token-generator";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid Entries"}
    }

    const {username, name, email, password} = validateFields.data;

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
        return ({error: "User with this email exists"})
    }

    const existingUserName = await prismadb.user.findUnique({
        where: {
            username
        }
    });

    if (existingUserName) {
        return  {"error":"User with this username exists"}
    }

    const encodePassword = await hash(password, 10);
        await prismadb.user.create({
            data: {
                username,
                name,
                email,
                password: encodePassword,
               
            }
        });


        const verifyToken = await generateToken(email);
        await sendVerificationEmail(verifyToken.email, verifyToken.token)

    return {success: "Check your email to verify it"}
}