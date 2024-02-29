import React from 'react'
interface Props {
    state: any

    fetchData?: (page: number) => void
    
}

const LoadMore: React.FC<Props> = ({state, fetchData}) => {
    if (state !== null && state.totalBlogs > state.results.length)
 {
    return (
        //@ts-ignore
            <button onClick={() => fetchData(state.page + 1)} className='text-dark-grey p-2 px-3 hover:bg-grey/50 rounded-md flex items-center gap-2'>
                Load More
            </button>
      ) 
 } 
}

export default LoadMore