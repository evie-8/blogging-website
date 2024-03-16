"use client";
import { findNotificationByType } from '@/actions/notify';
import React, { useEffect, useState } from 'react'
import PaginationData from '../home/PaginationData';
import { useSession } from 'next-auth/react';
import { $Enums } from '@prisma/client';
import Loader from '../ui/Loader';
import Notify from '../home/Notfiy';
import NotificationCard from './NotificationCard';
import Animation from '../ui/animation';
import LoadMore from '../home/LoadMore';

const  Notifications = () => {
    const [filter, setFilter] = useState<$Enums.Notify>('all');
    const filters:  $Enums.Notify[]  = ['all', 'like', 'reply', 'comment'];
    const [notifications, setNotifications] = useState<any | null>(null);
    const {data: session, update} = useSession()

    const fetchNotifications = async ({page = 1, deleted = 0}) => {
        await findNotificationByType({page, filter, deleted, userId:session?.user.id}).then(async(data: any) => {
           
             await PaginationData({array: notifications, data: data?.notifications, page, count: data?.count}).then((newData:any) => {
               
                setNotifications(newData);
             })
             await update()
          
         
        })
        
    }
    const handleClick = (event: any) => {
        const btn = event.target;

        setNotifications(null);
        setFilter(btn.innerHTML)
       
    }

    useEffect(() => {
       
        fetchNotifications({page: 1})
    },
     [filter])

    
  return (
    <div>
        
        <h1 className='max-md:hidden my-5'>Recent Notifications</h1>
        <div className='my-8 flex gap-6'>
            {
                filters.map((filterName, i) => 
               {
                return <button onClick={handleClick} className={`py-2 ${filter === filterName ? 'btn-dark' : 'btn-light'}`} key={i}>{filterName}</button>
               }
                    )
            }
        </div>
        {
            notifications === null ?  <Loader/> :
            <>
            {
                notifications.results.length ? 
                notifications.results.map((notification: any, i: number) => {
                    return <Animation key={i} transition={{duration: 1, delay: i * .08}}>
                            <NotificationCard index={i} notification={notification} state={{notifications, setNotifications}}/>
                    </Animation>
                })

                : <Notify message='No Notifications'/> 
            }
             <LoadMore state={notifications} fetchData2={fetchNotifications} moreParams={{deleted:notifications.deleted}}/>
              
            </>
        }
    </div>
  )
}

export default Notifications