//@ts-ignore
const PaginationData = async({createArray = false, array, data , page, count}) => {
  let newObj;

  if (array !== null && !createArray) {
    newObj = {...array, results: [...array.results, ...data], page: page}
  
  } else {
        
    newObj = {results: data, page: 1, totalBlogs: count}
           
  }
 
  return newObj
}

export default PaginationData