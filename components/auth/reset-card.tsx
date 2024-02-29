"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResetSchema } from "@/schemas/schema";
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

import Animation from "../ui/animation";

import {FormError, FormSuccess} from "@/components/auth/form-message";
import { reset } from "@/actions/reset";
import Link from "next/link";
import { BeatLoader } from "react-spinners";

interface SignProps {
type: string;
heading: string;
}


const ResetCard: React.FC<SignProps> = ({
    type,
    heading
}) => {

    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
    
    const  form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
          email: "",
        },
      });
    

      const onSubmit =  (values: z.infer<typeof ResetSchema> )=> {
        
        setErrorMessage("");
        setSucessMessage("");
      
               
        setLoading( () => {
            reset(values).then((data) => {
                setErrorMessage(data.error);
                setSucessMessage(data.success);
            })
           
        });
                        
                
        }


    return (
     <Animation key={type}>
           <section className="h-cover flex flex-col items-center justify-center my-0">
        <Form {...form}>

        
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[80%] max-w-[400px] border border-transparent shadow-custom rounded-md p-6">
               <h1 className="text-3xl font-gelasio capitalize text-center mt-2">{heading}</h1>

               <span className="mt-4 block"></span>
  
                <FormError message={errorMessage}/>
                <FormSuccess message={successMessage}/>
                
                <span className="mt-4 block"></span>

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
              
                <Button  className="btn-dark w-full py-7 center mt-4" type='submit' disabled={loading}>
                 {!loading ? (  <span>Send reset email</span> ) : ( <BeatLoader />)}
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

export default ResetCard;