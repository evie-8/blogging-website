import { AnimatePresence, motion,  Transition, Variants } from "framer-motion";
interface AnimationProps {
    children: React.ReactNode;
    key?: string;
    initial?: Variants;
    animate?: Variants;
    transition?: Transition;
    className?: string;


}
const Animation: React.FC<AnimationProps> = ({
    key,
    initial = {opacity: 0}, 
    animate  = {opacity: 1}, 
    transition = {duration: 1},
    className,
    children
}) => {
    return (
       <AnimatePresence>
         <motion.div className={className} key={key} initial={initial} animate={animate} transition={transition} >
            {children}
        </motion.div>
       </AnimatePresence>
    )
}

export default Animation;