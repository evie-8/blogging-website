"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ChangePasswordSchema } from "@/schemas/schema";
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

import { BeatLoader } from "react-spinners";
import { changePassword } from "@/actions/new-password";


const ChangePassword = () => {

    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
    
    const  form = useForm<z.infer<typeof  ChangePasswordSchema>>({
        resolver: zodResolver( ChangePasswordSchema),
        defaultValues: {
       
          password: "",
          confirmPassword: "",
          currentPassword: ""
        },
      });
    

      const onSubmit =  (values: z.infer<typeof  ChangePasswordSchema> )=> {
        
        setErrorMessage("");
        setSucessMessage("");
                
        setLoading( () => {
            changePassword(values).then((data) => {
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
     <Animation>
        
          <Form {...form}>

            <div  className=" w-full py-10 md:min-w-[400px]">
            <h1 className="max-md:hidden ">Change Password</h1>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                
                <span className="mt-4 block"></span>

                <FormError message={errorMessage}/>
                <FormSuccess message={successMessage}/>
                
                <span className="mt-4 block"></span>
                <FormField
                control={form.control}
                name="currentPassword"
                render={( { field }) => (
                    <FormItem>
                    
                        <FormControl>
                            <Input className="" placeholder="Current Password" icon="fi-rr-lock" type="password" {...field} disabled={loading}/>
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
                            <Input className="" placeholder="New Password" icon="fi-rr-lock" type="password" {...field} disabled={loading}/>
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
                            <Input placeholder="Re enter password" icon="fi-rr-lock" type="password" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                )}
                />
            
                <button  className="btn-dark px-7 mt-4" type='submit' disabled={loading}>
                {!loading ? (<span>Change Password</span>) : (<BeatLoader />)}
                </button>


            </form>
            </div>
           
        </Form>

      
      
    </Animation>
    
)}

export default ChangePassword;
