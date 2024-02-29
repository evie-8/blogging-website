"use client"
import React, { useEffect, useRef, useState } from 'react'
interface Props {
    routes: string[],
    hiddenRoutes?: string[],
    defaultIndex?: number,
    children:  React.ReactNode

}
export let activeLine: any 
export let  activeBtn: any 

const PageNavigation: React.FC<Props> =({
    routes,
    hiddenRoutes = [],
    defaultIndex = 0,
    children
}) => {

    const [activeIndex, setActiveIndex] = useState(0);
    
    activeLine = useRef<any>()
    activeBtn = useRef<any>()

    //@ts-ignore
    const changeActiveLine = (btn, i) => {
        const {offsetWidth, offsetLeft } = btn
        activeLine.current.style.width = offsetWidth + 'px'
        activeLine.current.style.left = offsetLeft + 'px'
        setActiveIndex(i)
    }

    useEffect(() => {
        changeActiveLine(activeBtn.current, defaultIndex)
    }, [])
  return (
 <>
    <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
     {routes.map((route, i) => {
        return (
            <button ref={i === defaultIndex ? activeBtn : null } key={i} className={`p-2 px-5 capitalize ` + 
            (activeIndex === i ? 'text-black': 'text-dark-grey ' ) + (hiddenRoutes.includes(route) ? 'md:hidden' : "" )
            }
            onClick={(event) => {changeActiveLine(event.target, i)}}
            >
                {route}
            </button>
        )
     })} 

     <hr ref={activeLine} className='absolute bottom-0 duration-300'/>
    </div>
     {Array.isArray(children) ? children[activeIndex] : children}
 </>
  ) 
}

export default PageNavigation  