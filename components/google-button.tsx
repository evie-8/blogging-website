"use client"
import { signIn } from 'next-auth/react';

import { FC, MouseEventHandler, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

interface GoogleSignInButtonProps {
  children: ReactNode;
  
  
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> =  ({ children}) => {
  const onclick = () => {
     signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
     })}
  
  return (
    <Button onClick={onclick} className="btn-dark w-[100%] max-w-[400px] py-7 flex justify-center items-center gap-4">
    <Image src="/images/google.png" alt="Google Logo" width={20} height={20} style={{width: "25px", height: "25px"}}/>
      {children}  
    </Button>
  );
};

export default GoogleSignInButton;