"use client"
import React, { createContext, useEffect, useState } from 'react'

export interface Props {
    theme: string,
    setTheme:  React.Dispatch<React.SetStateAction<string>>;
}

export const themeContext = createContext<Props>({} as Props);


export const ThemeProvider = ({ children}: {children:any}) => {

    const [theme, setTheme] = useState('')

useEffect(() => {
  
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    setTheme(storedTheme);
} else {
  const themePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(() => themePreference() ? 'dark': 'light')

}
}, []);

useEffect(() => {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
 
}, [theme])
    
  return (
    <themeContext.Provider value={{theme, setTheme}}>
        
        {children}
   
    </themeContext.Provider>
   
  )
}
