"use client";

import React, { useContext, useEffect, useRef, useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {  EditProfileSchema } from "@/schemas/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  
  FormLabel,
  
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import Animation from "../ui/animation";

import {FormError, FormSuccess} from "@/components/auth/form-message";

import { BeatLoader } from "react-spinners";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Textarea } from "../ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Switch } from "../ui/switch";
import { updateProfile } from "@/actions/edit-profile";
import { useRouter } from "next/navigation";
import { themeContext } from "../ui/theme";


const ProfileEdit = () => {
    const user = useCurrentUser();
    const {update} = useSession();
    const {theme} = useContext(themeContext)
   
    const router = useRouter();
    const [loading, setLoading] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");
    const [successMessage, setSucessMessage] = useState<string | undefined>("");
    const characterLimit = 200;
    const [charLimit, setCharLimit] = useState(characterLimit);
    const ImageRef = useRef<any>();
    const [newProfileImage, setNewProfileImage] = useState(user?.image);
  
    const  form  = useForm<z.infer<typeof  EditProfileSchema>>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
          name: user?.name || undefined,
          username: user?.username || undefined,
          image: user?.image ||  undefined,
          email: user?.email || undefined,
          bio: user?.bio || undefined,
          isTwoFactorEnabled : user?.isTwoFactorEnabled || undefined,
          socials: {
            youtube: user?.socials.youtube || undefined,
            instagram: user?.socials.instagram || undefined,
            facebook: user?.socials.facebook || undefined,
            twitter: user?.socials.twitter || undefined,
            github: user?.socials.github || undefined,
            website: user?.socials.website || undefined,
          }
        },
      });
   
      const characterLimitChange = (event: any) => {
        setCharLimit(characterLimit - event.currentTarget.value.length)
      }
    
      const uploadProfileImagePreview = (event: any) => {

        let image = event.target.files[0];
     
        ImageRef.current.src = URL.createObjectURL(image);
       
          setNewProfileImage(image);
      }

      const uploadProfileImage = async (event: any) => {
        event.preventDefault();
        console.log(event.target)
        if (newProfileImage) {
            const loading = toast.loading("Uploading ...");
            
            event.target.setAttribute("disabled", true)

            const forms = new FormData();
            forms.append('file', newProfileImage);
            forms.append('upload_preset', 'qayh85jr');
        
            await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
            forms)
                .then((result) =>
                {
                    if (result && result.data && result.data.secure_url) {
                       
                        form.setValue('image', result.data.secure_url)
                        toast.dismiss(loading);
                        toast.success("New profile image loaded 🎉🎉");
                        event.target.setAttribute("disabled", false);
                                          
                    }

                })
                .catch((error) => {
                    toast.dismiss(loading);
                    toast.error("Failed to upload new profile image 😔");
                    event.target.setAttribute("disabled", false);
                   
                    console.log(error);
                })

     
        }
      }

   
useEffect(() => {

  if (form.getValues().bio !== undefined) {
     //@ts-ignore
    setCharLimit(characterLimit - form.getValues().bio?.length)
  }
}, [])


      const onSubmit =  (values: z.infer<typeof EditProfileSchema> )=> {
        
        setErrorMessage("");
        setSucessMessage("");
                
        setLoading( () => {
           updateProfile(values).then((data) => {

            if (data.error) {
              form.reset();
              setErrorMessage(data.error);
             }
              if (data.success) {
                  
                 
                  toast('Profile Updated', {icon: '✅'})
                  setSucessMessage(data.success);
                  form.reset();
                  update();
                 
                  router.refresh()     
              
              }
           })
             });                                   
        }

    return (
     <Animation>
        <Toaster toastOptions={{ style: {background: (theme) ==='light' ? '#FFFFFF': '#242424', color:(theme) ==='light'? '#6b6b6b' : '#f3f3f3' }}}/>
    
          <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} >
                <h1 className="max-md:hidden py-5">Edit Profile</h1>
             
        
                <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">

                <FormField
                control={form.control}
                name="image"
                render={( { field }) => (
                    <FormItem className="max-lg:center mb-5">
                    
                            <label htmlFor="uploadImage" className="relative flex flex-col items-center justify-center w-48 h-48 bg-grey rounded-full overflow-hidden">
                              
                                <img src={`${user?.image ? user.image : "/images/profile-avatar.png"}`}  ref={ImageRef} alt="profile Image"/> 
                              
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer">
                                    Upload Image
                                </div>

                            </label>
                                
                            <Input id="uploadImage" className="" icon=""  type="file" accept=".jpeg, .jpg, .png"  disabled={loading} hidden onChange={uploadProfileImagePreview}/>
                                <FormControl>
                                    <Input id='imageload'  icon="" {...field} defaultValue={field.value} disabled={loading}  hidden/>
                                  </FormControl>
                     
                                <FormLabel htmlFor="imageload">
                                  <button  className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={uploadProfileImage} disabled={loading}>Upload</button>
                                </FormLabel>
                                    
                                <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                )}
                /> 

                <div className="w-full">
                
                  <FormError message={errorMessage}/>
                  <FormSuccess message={successMessage}/>

             
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
                    <FormField
                    control={form.control}
                    name="name"
                    render={( { field }) => (
                    <FormItem >
                    
                        <FormControl>
                            <Input placeholder="Name" icon="fi-rr-user" defaultValue={field.value} {...field} disabled={user?.isOAuth ? true : loading}/>
                        </FormControl>
                        <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="email"
                render={( { field }) => (
                    <FormItem >
                    
                        <FormControl>
                            <Input placeholder="Email" icon="fi-rr-envelope" type="email"   defaultValue={field.value}  {...field} disabled={true}/>
                          
                        </FormControl>
                        <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                )}
                />
                   </div>
                 
                <FormField
                    control={form.control}
                    name="username"
                    render={( { field }) => (
                    <FormItem className="mb-7">
                    
                        <FormControl>
                            <Input placeholder="user name" icon="fi-rr-at"  defaultValue={field.value} {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage className='text-danger mb-2 italic'/>
                        <p className="text-dark-grey -mt-3 italic">User name will be used in search and will be visible to all users</p>
                       
                    </FormItem>
                )}
                />

                  {     
                  !user?.isOAuth ?
                <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={( { field }) => (
                    <FormItem className="text-dark-grey flex flex-row items-center justify-between rounded-lg border-none p-3 py-5 input-box">
                    
                         <div className="space-y-0.5">
                          <FormLabel className="font-normal text-base">
                            Two Factor Authentication
                          </FormLabel>
                         <FormDescription className="italic font-semibold">Enable two factor authentication on your account</FormDescription>
                         </div>
                         <FormControl>
                          <Switch disabled={loading}  checked={field.value}  onCheckedChange={field.onChange}/>
                         </FormControl>
                         
                         <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                )}
                /> : ''
                    }

                <FormField
                    control={form.control}
                    name="bio"
                    render={( { field }) => (
                    <FormItem >
                    
                        <FormControl >
                            <Textarea  placeholder="Bio" defaultValue={field.value}  maxLength={characterLimit} {...field} disabled={loading} 
                             className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" onChangeCapture={characterLimitChange}></Textarea>
                        </FormControl>
                        <p className="mt-1 text-dark-grey text-right italic text-sm">{charLimit} characters left</p>
                        <FormMessage className='text-danger mb-2 italic'/>
                    </FormItem>
                    
                )}
                />

                <p className="my-6 text-dark-grey">Add Your Social Handles Below</p>
                <div className="md:grid md:grid-cols-2 gap-x-6">
                            
                    {
                      //@ts-ignore
                      Object.keys(form.getValues().socials).map((key, index) => (
                                    <FormField
                                      key={index}
                                      control={form.control}
                                      //@ts-ignore
                                      name={`socials.${key}`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input placeholder='https://' 
                                            //@ts-ignore
                                            defaultValue={field.value} {...field} 
                                            disabled={loading}  
                                            icon={`${key !== 'website' ? `${key === 'twitter' ? `fi-brands-${key}-alt` : `fi-brands-${key}`} ` : 'fi-rr-globe'}`}/>
                                          </FormControl>
                                          <FormMessage className='text-danger mb-2 italic' />
                                        </FormItem>
                                      )}
                                    />
                     ))
                    }
                       
                </div>
              <button  className="btn-dark px-5 mt-4" type='submit' disabled={loading}>
                {!loading ? (<span>Update</span>) : (<BeatLoader />)}
                </button>
             
                      </div>
                </div>
               
            </form>
              
        </Form>  
      
    </Animation>
    
)}

export default ProfileEdit;
