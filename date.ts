const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursaday', 'Friday']

export const getDay = (date: Date) => {
    const newDate = new Date(date);

    return `${newDate.getDate()} ${months[newDate.getMonth()]}`
}

export const getFullDay = (date: Date) => {
    const newDate = new Date(date);

    return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`
}