"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResentEmail } from "@/lib/mail";
import { generateResetPaswordToken } from "@/lib/token-generator";
import { ResetSchema } from "@/schemas/schema";
import * as z from "zod";


export const reset = async (values: z.infer<typeof ResetSchema>) => {

    const validateFields = ResetSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid email"}
    }

    const {email} = validateFields.data

    const existingEmail = await getUserByEmail(email);

    if (!existingEmail) {
        return {error: "User with this email does not exist"};
    }

    const passwordResetToken = await generateResetPaswordToken(email);
    await sendPasswordResentEmail(passwordResetToken.email, existingEmail.name, passwordResetToken.token)


    return {success: "Verfication email sent!"}
}