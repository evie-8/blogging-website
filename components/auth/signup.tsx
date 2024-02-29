"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { RegisterSchema } from "@/schemas/schema";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import GoogleSignInButton from "@/components/google-button";
import Link from "next/link";
import Animation from "../ui/animation";

import {FormError, FormSuccess} from "@/components/auth/form-message";
import { register } from "@/actions/register";
import { BeatLoader } from "react-spinners";

interface SignProps {
type: string;
heading: string;
}


const SignUp: React.FC<SignProps> = ({
    type,
    heading
}) => {
    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
  
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
          username: "",
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
        }
    })
      
        const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
            setErrorMessage("");
            setSucessMessage("");
           
                    setLoading( () => {
                        register(values)
                        .then(data => {
                            if (data.error) {
                                form.reset();
                                setErrorMessage(data.error);
                               }
                                if (data.success) {
                                    form.reset();
                                    setSucessMessage(data.success);
                                
                                }
                        })
                    });
                }
                    

    return (
     <Animation key={type}>
           <section className="h-cover flex flex-col items-center justify-center  my-14 md:my-5">

           <div className="w-[80%] max-w-[400px]  border border-transparent shadow-custom rounded-md p-6">

           <Form {...form}>

        
<form onSubmit={form.handleSubmit(onSubmit)}>
   <h1 className="text-4xl font-gelasio capitalize text-center mb-5 mt-7 md:mt-2">{heading}</h1>
  
      
<FormError message={errorMessage}/>
<FormSuccess message={successMessage}/>
<span className="mt-4 block"></span>


   <FormField
   control={form.control}
   name="username"
   render={( { field }) => (
       <FormItem>

           <FormControl>
               <Input placeholder="User Name" icon="fi-rr-user" {...field} disabled={loading}/>
           </FormControl>
           <FormMessage className='text-danger mb-2 italic'/>
       </FormItem>
   )}
   />


<FormField
    control={form.control}
    name="name"
    render={( { field }) => (
        <FormItem>
          
            <FormControl>
                <Input placeholder="Full Name" icon="fi-rr-user" {...field} disabled={loading}/>
            </FormControl>
            <FormMessage className='text-danger mb-2 italic'/>
        </FormItem>
    )}
    />

<FormField
    control={form.control}
    name="email"
    render={( { field }) => (
        <FormItem>
          
            <FormControl>
                <Input placeholder="Email" icon="fi-rr-envelope" {...field} disabled={loading}/>
            </FormControl>
            <FormMessage className='text-danger mb-2 italic'/>
        </FormItem>
    )}
    />

    <FormField
    control={form.control}
    name="password"
    render={( { field }) => (
        <FormItem>
          
            <FormControl>
                <Input placeholder="Password" icon="fi-rr-key" type="password" {...field} disabled={loading}/>
            </FormControl>
            <FormMessage className='text-danger mb-2 italic'/>
        </FormItem>
    )}
    /> 
    
    <FormField
    control={form.control}
    name="confirmPassword"
    render={( { field }) => (
        <FormItem>
        
            <FormControl>
                <Input placeholder="Re enter password" icon="fi-rr-key" type="password" {...field} disabled={loading}/>
            </FormControl>
            <FormMessage className='text-danger mb-2 italic'/>
        </FormItem>
    )}
    />
  

    <Button  className="btn-dark w-full py-7 center mt-4" type='submit' disabled={loading}>
     {loading ? ( <BeatLoader/>) : ( <span>Sign up</span>)}
    </Button>

</form>

<div className='my-4 flex w-[100%] max-w-[400px] " items-center justify-evenly
before:mr-4 before:block before:h-px before:flex-grow before:bg-black opacity-[60%] before:opacity-[60%] 
after:ml-4 after:block after:h-px after:flex-grow after:bg-black after:opacity-[60%]'>
or
</div>
<GoogleSignInButton><span>Continue With Google</span></GoogleSignInButton>
   
        <p className="mt-6 text-dark-grey text-xl text-center">
            Already a member ?
            <Link href="/auth/sign-in" className="text-black underline ml-1 hover:no-underline">Sign In</Link>
        </p>
   
</Form>
           </div>
     
        </section>
     </Animation>
    )
}

export default SignUp;