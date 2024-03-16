import React from 'react'
interface Props {
    state: any;

    fetchData?: (page: number) => void;
    fetchData2?: ({page, deleted, draft}:{page: number, deleted: number, draft:boolean}) => void;
    moreParams? : {
        deleted?: number,
        draft?: boolean
    }
    
}

const LoadMore: React.FC<Props> = ({state, fetchData, moreParams, fetchData2}) => {
    if (state !== null && state.totalBlogs > state.results.length)
 {
    return (
        //@ts-ignore
            <button onClick={ !moreParams ? () => fetchData(state.page + 1) : () => fetchData2({page: state.page + 1, deleted:moreParams.deleted, draft: moreParams.draft})} className='text-dark-grey p-2 px-3 hover:bg-grey/50 rounded-md flex items-center gap-2'>
                Load More
            </button>
      ) 
 } 
}

export default LoadMore