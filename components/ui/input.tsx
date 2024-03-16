"use client";
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {

    const [visible, setVisible] = React.useState(false);
    return (
        <div className="relative w-[100%] mb-4">
      <input
        type={type === "password" ? visible ? "text" : "password": type}
        className={cn("input-box mt-2",  
          className
        )}
        
        ref={ref}
        {...props}
      />
      <i className={"fi " + icon + " input-icon mt-1"}></i>
       {
        type === "password" ? <i className={"fi fi-rr-eye" + (!visible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => setVisible(current => !current)}></i> : ""
       }

      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
