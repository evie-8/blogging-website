import axios from "axios";
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


 export const ChangePasswordSchema = z.object({
 
      currentPassword: z.string()
      .min(1, 'Password is required')
      .min(10, 'Password must have atleast 10 characters')
      .regex(/[A-Z]/, 'Password must contain at least one capital letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
     .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol'),
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

export const EditProfileSchema = z.object({
 
    username: z.optional(z.string().min(1, 'Username is required').max(100)),
    email: z.optional(z.string().min(1, 'Email is required')),
    name:  z.optional(z.string().min(1, 'Name is required').max(100)),
    image: z.optional(z.string()),
    bio: z.optional(z.string().max(200)),
    isTwoFactorEnabled : z.optional(z.boolean()),
    socials: z.optional(z.object({
        youtube: z.optional(z.string()).refine((val) => 
        val === undefined || val.length == 0  || validateURL(val, `youtube.com`)
        , {
          message: 'Invalid youtube url'

        }),
        instagram: z.optional(z.string()).refine((val) => 
        val === undefined  || val.length == 0 || validateURL(val, `instagram.com`)
      , {
        message: 'Invalid instagram url'

      }),
        facebook: z.optional(z.string()).refine((val) => 
        val === undefined || val.length == 0  || validateURL(val, `facebook.com`)
      , {
        message: 'Invalid facebook url'

      }),
        twitter: z.optional(z.string()).refine((val) => 
        val === undefined || val.length == 0 || validateURL(val, `twitter.com`)
      , {
        message: 'Invalid twitter url'

      }),
        github:z.optional(z.string()).refine((val) => 
        val === undefined || val.length == 0  || validateURL(val, `github.com`)
      , {
        message: 'Invalid github url'

      }),
        website:  z.optional(z.string()).refine((val) => 
        val === undefined || val.length == 0  || validateURL(val, ''),
        {
          message: 'invalid url'
        }),
    }))
}).refine( async (data) =>
    
data.username === undefined || await getUser(data.username, data.email)

,{
message: 'User with this username exists',
path: ['username']      
})


function validateURL(url: string, hostname: string) {
  try {
      const parsedURL = new URL(url);
      if (hostname) {
          return parsedURL.hostname.includes(hostname);
      } else {
          return true; 
      }
  } catch (error) {
      return false;
  }
}

async function getUser(id: string, email: string | undefined) {
  try {
   const res =  await axios.get(`https://blogging-website-npkv.vercel.app/api/users/${id}/${email}`);
console.log('yy', res.data)
  return res.data
  } catch(error) {
    console.log('pp', error)
  return false
  }
} 