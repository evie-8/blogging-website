"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {NewPasswordSchema } from "@/schemas/schema";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import Animation from "../ui/animation";

import {FormError, FormSuccess} from "@/components/auth/form-message";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { BeatLoader } from "react-spinners";

interface SignProps {
type: string;
heading: string;
}


const NewPasswordCard: React.FC<SignProps> = ({
    type,
    heading
}) => {

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
    
    const  form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
       
          password: "",
          confirmPassword: "",
        },
      });
    

      const onSubmit =  (values: z.infer<typeof NewPasswordSchema> )=> {
        
        setErrorMessage("");
        setSucessMessage("");
                
        setLoading( () => {
          newPassword(values, token).then((data) => {
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
           <section className="h-cover flex flex-col items-center justify-center my-0">
        <Form {...form}>

        
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80%] max-w-[400px] border border-transparent rounded-md shadow-custom p-6">
               <h1 className="text-3xl font-gelasio capitalize text-center mt-2">{heading}</h1>

               <span className="mt-4 block"></span>
  
                <FormError message={errorMessage}/>
                <FormSuccess message={successMessage}/>
                
                <span className="mt-4 block"></span>

                <FormField
                control={form.control}
                name="password"
                render={( { field }) => (
                    <FormItem>
                      
                        <FormControl>
                            <Input placeholder="New Password" icon="fi-rr-key" type="password" {...field} disabled={loading}/>
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
                {!loading ? (   <span>Reset Password</span>) : (<BeatLoader />)}
                </Button>

                <p className="mt-6 text-dark-grey text-xl text-center">
                        <Link href="/auth/sign-in" className="text-black underline ml-1 hover:no-underline">Back to login</Link>
                    </p>

            </form>
          
                
        </Form>
        </section>
     </Animation>
    )
}

export default NewPasswordCard;