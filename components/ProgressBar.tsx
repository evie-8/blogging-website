"use client"
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressLoader = () => {
    return (
        <ProgressBar
        height="2px"
        color="#242424"
        options={{ showSpinner: false }}
        shallowRouting
        />
    )
}
export default ProgressLoader