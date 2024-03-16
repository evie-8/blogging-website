import { getFullDay } from '@/date'
import Link from 'next/link'
import React from 'react'
interface Props {
    bio: string,
    socials: {
      youtube: string,
      instagram: string,
      facebook: string,
      twitter: string,
      github: string,
      website: string,
    }
    joinedAt: any,
    className?: string

}

const AboutUser: React.FC<Props> = ({
    bio, 
    socials,
    joinedAt,
    className = ''
}) => {
  return (
   <div className={`md:w-[90%] md:mt-7 ${className}`}>
   <p className='text-xl leading-7'>{bio.length ? bio : 'No User Bio'}</p>
   <div className='flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey'>
      {
        Object.keys(socials).map((key) => {
          //@ts-ignore
          const link = socials[key]
          return link ? <Link href={link} key={key} target='_blank'>
            <i className={`text-2xl hover:text-black fi ` + (`${key !== 'website' ? `${key === 'twitter' ? `fi-brands-${key}-alt` : `fi-brands-${key}`} ` : 'fi-rr-globe'}`)}></i>
            </Link> : ''
        })
      }
   </div>
   <p className='text-xl leading-7 text-dark-grey'>Joined on {getFullDay(joinedAt)}</p>
   </div>
  )
}

export default AboutUser