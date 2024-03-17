
import ResetPasswordEmail from "@/app/emails";
import ConfirmAccount from "@/app/emails/account-ccofimation";
import TwoFactorCodeEmail from "@/app/emails/two-factor";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_AUTH_URL
export const sendVerificationEmail = async (email: string,
    token: string) =>{
        const confirmationLink = `${domain}/auth/new-verify?token=${token}`;
        await resend.emails.send({
            from: "mail@eazywrite.me",
            to: email,
            subject: "Confirm your account",
            react: ConfirmAccount({confirmEmailLink: confirmationLink})
        });
    
}


export const sendPasswordResentEmail = async (email: string, name: string,
    token: string) =>{
        const confirmationLink = `${domain}/auth/new-password?token=${token}`;
        await resend.emails.send({
            from: "mail@eazywrite.me",
            to: email,
            subject: "Reset Your Password",
           react: ResetPasswordEmail({name, resetPasswordLink: confirmationLink})
        });
    
}



export const sendTwoFactorEmail = async (email: string, token: string) =>{
        await resend.emails.send({
            from:"mail@eazywrite.me",
            to: email,
            subject: "2FA Code",
           react: TwoFactorCodeEmail({validationCode: token})
        });
    
}