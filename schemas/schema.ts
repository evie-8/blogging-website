import * as z from "zod";

export const RegisterSchema=  z.object({
      username: z.string().min(1, 'Username is required').max(100),
      email: z.string().min(1, 'Email is required').email('Invalid email'),
      name:  z.string().min(1, 'Name is required').max(100),
      password: z
        .string()
        .min(1, 'Password is required')
        .min(10, 'Password must have atleast 10 characters')
        .regex(/[A-Z]/, 'Password must contain at least one capital letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
       .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
      confirmPassword: z.string().min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Password do not match',
    });

export const SignInSchema = z.object({
 
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(10, 'Invalid password')
      .regex(/[A-Z]/, 'Invalid password')
      .regex(/[0-9]/, 'Invalid password')
     .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Invalid password'),
     code: z.optional(z.string().max(6))
})


export const ResetSchema = z.object({
 
  email: z.string().min(1, 'Email is required').email('Invalid email'),

})


export const NewPasswordSchema = z.object({
 
  password: z
      .string()
      .min(1, 'Password is required')
      .min(10, 'Password must have atleast 10 characters')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
     .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
     confirmPassword: z.string().min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Password do not match',
    });