"use client"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useContext } from 'react';
import { themeContext } from './ui/theme';

const ProgressLoader = () => {
    const {theme} = useContext(themeContext)
    
    if (theme === 'dark') {
    return (
        <ProgressBar
        height="2px"
        color = "#ffffff"
        options={{ showSpinner: false }}
        shallowRouting
        />
    )
    } 
       if (theme === 'light') {
        return (
            <ProgressBar
            height="2px"
            color = "#242424"
            options={{ showSpinner: false }}
            shallowRouting
            />
        )
       }

       return (
        <ProgressBar
        height="2px"
        color = "#FF6666"
        options={{ showSpinner: false }}
        shallowRouting
        />
    )

}
export default ProgressLoader