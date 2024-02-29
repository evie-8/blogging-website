"use client";

import Image from "next/image"
import { Button } from "../ui/button"
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import Link from "next/link";

const ErrorCard = () => {

    const onclick = () => {
        signIn("google", {
         callbackUrl: DEFAULT_LOGIN_REDIRECT,
        })}
     
    return (
        
            <section className="flex flex-col items-center justify-center border rounded-md shadow-custom border-transparent p-6 py-24 mx-auto  my-[70px] max-w-[80%] ">
                <div className=" max-w-[500px]">
                <h1 className="text-3xl font-gelasio text-center mb-5 mt-7 md:mt-2">Sorry, we didn’t recognize that account.</h1>
                <h1 className="text-xl font-inter text-center mb-5 mt-7 md:mt-2">Would you like to create a new account?</h1>
                    <Button  onClick={onclick} className=" hover:opacity-50 btn-dark bg-transparent border text-center rounded-full m-auto border-black w-[60%] max-w-[500px] py-7
                    flex justify-center items-center gap-4">
                  <Image src="/images/google.png" 
                  alt="Google Logo" 
                  width={20} height={20} 
                  style={{width: "25px", height: "25px"}}/>
                       <span className="text-black text-md"> Sign up with google</span>
                     </Button>
                     <Link href="/auth/sign-in" className="text-green text-center block m-auto text-md mt-7 hover:opacity-50"> See sign in options</Link>
  
                </div>

        </section>
    
    )
}

export default ErrorCard