"use client";
import { newVerify } from "@/actions/new-verification";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { FormError, FormSuccess } from "./form-message";

const VerificationCard = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();


    const onSubmit = useCallback(() => {

        if (success || error) return;

        if (!token) {
            setError("Missing token");
            return
        }
        
      newVerify(token).then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
    }, [token, success, error])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])
     
    return (
        
            <section className=" mx-auto  my-[60px] flex items-center justify-center max-w-[80%]">
                <div className=" md:min-w-[80%] max-w-[500px]  flex flex-col items-center justify-center border rounded-md shadow-custom border-transparent p-20 py-20">
                <i className="fi fi-rr-envelope text-black text-5xl text-center"></i>
                <h1 className="text-xl font-inter text-center mb-5 mt-7 md:mt-2">Confirming  your email</h1>
               {!success && !error && ( <ScaleLoader/>)}
               <FormSuccess message={success}/>
             {!success && (  <FormError message={error}/>)}
                <Link href="/auth/sign-in" className=" bg-white border shadow  px-4 py-2 rounded-full text-green text-center block m-auto text-md mt-5 hover:opacity-50">Go to sign in</Link>
  
                </div>

        </section>
    
    )
}

export default VerificationCard