interface FormErrorProps {
    message?: string;
}

const FormError = ({
    message
}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div  className="bg-danger/15  text-danger  flex  items-center justify-left gap-3 rounded-md p-4">
       <button className="mt-1 ">
       <i className="fi fi-rr-exclamation h-12 w-12 text-xl text-danger"></i> 
       </button>
        <span>{message}</span>
          </div>

    )
}

const FormSuccess = ({
    message
}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div  className="bg-emerald/15  text-emerald flex  items-center justify-left gap-3 rounded-md p-4">
       <button className="mt-1 ">
       <i className="fi fi-rr-check-circle h-12 w-12 text-xl text-emerald"></i> 
       </button>
        <span>{message}</span>
          </div>

    )
}

export  {FormError, FormSuccess}

