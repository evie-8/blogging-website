"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SignInSchema } from "@/schemas/schema";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import GoogleSignInButton from "@/components/google-button";
import Link from "next/link";
import Animation from "../ui/animation";

import {FormError, FormSuccess} from "@/components/auth/form-message";
import { Login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { BeatLoader} from "react-spinners";

interface SignProps {
type: string;
heading: string;
}


const SignIn: React.FC<SignProps> = ({
    type,
    heading
}) => {

    const searchParams = useSearchParams();
    const urlError =  searchParams.get('error') === "OAuthAccountNotLinked" ? "Try another Login option!" : "";
    const callbackUrl =searchParams.get("callbackUrl");
    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
    const [show, setShow] = useState(false);


    const  form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      });
    

      const onSubmit =  (values: z.infer<typeof SignInSchema> )=> {
        
        setErrorMessage("");
        setSucessMessage("");
      
               
        setLoading( () => {
            Login(values, callbackUrl).then(data => {
              if (data?.error) {

                form.reset();
                setErrorMessage(data?.error);
              }
               
              if (data?.success) {
                form.reset();
                setSucessMessage(data?.success);
              }

              if (data?.twoFactor) {
                setShow(true);
              }
            }).catch( () => setErrorMessage("Something went wrong"))
        });
                        
                
        }


    return (
     <Animation key={type}>
           <section className="h-cover flex flex-col items-center justify-center my-12 md:my-5">
            <div className="w-[80%] max-w-[400px]  border border-transparent shadow-custom rounded-md p-6">

            <Form {...form}>    
     
                <form onSubmit={form.handleSubmit(onSubmit)}>
    
     <h1 className="text-4xl font-gelasio text-center mb-5 mt-7 md:mt-2">{ show ? "Enter 2FA code": heading}</h1>
   
     <FormError message={errorMessage || urlError}/>
        <FormSuccess message={successMessage}/>
        
   <span className="mt-4 block"></span>


    {show && (
        <>
          <FormField
          control={form.control}
          name="code"
          render={( { field }) => (
              <FormItem>
                <FormLabel className="pl-2 text-lg text-dark-grey">Two Factor Code</FormLabel>
                  <FormControl>
                      <Input placeholder="######" icon="fi-rr-key" {...field} disabled={loading}/>
                  </FormControl>
                  <FormMessage className='text-danger mb-2 italic'/>
              </FormItem>
          )}
          />
                
   <span className="mt-4 block"></span>
                </>
          
    )}

    { !show && (
        <>
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


            <p className="mt-6 text-dark-grey text-xl text-left">
            
            <Link href="/auth/reset" className="text-black underline ml-1 hover:no-underline">Forgot password?</Link>
        </p>
        </>
    )

    }


    <Button  className="btn-dark w-full py-7 center mt-4" type='submit' disabled={loading}>
      
    {!loading ? (
         <span>{show ?  "Confirm" : "Sign in"}</span>
    ) : ( ( <BeatLoader />) ) }
    </Button>

                </form>

{
!show && (
    <>
         <div className='my-4 flex  max-w-[400px] w-full items-center justify-evenly
before:mr-4 before:block before:h-px before:flex-grow before:bg-black opacity-[60%] before:opacity-[60%] 
after:ml-4 after:block after:h-px after:flex-grow after:bg-black after:opacity-[60%]'>
or
</div>

<GoogleSignInButton><span>Continue With Google</span></GoogleSignInButton>
   
        <p className="mt-6 text-dark-grey text-xl text-center">
            Do not have an account?
            <Link href="/auth/sign-up" className="text-black underline ml-1 hover:no-underline">Join Us</Link>
        </p>
    </>
)
}
    
</Form>

            </div>
      
        </section>
     </Animation>
    )
}

export default SignIn;