
import Link from "next/link"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"

interface Props {
    user: any
}

const UserCard: React.FC<Props> = ({user}) => {
    return (
     <>
     {user ? 
    (
        <Link href={`/user/${user.username}`} className="flex gap-5 items-center mb-5">
        <Avatar className="w-14 h-14">
            <AvatarImage src={user.image} className="w-full h-full object-cover rounded-full" />
            <AvatarFallback className="w-full h-full font-xl object-cover rounded-full bg-black text-white text-base">
                 {user.name.split(" ")[0][0]}
            </AvatarFallback>
        </Avatar>
        <div >
          <h1 className="font-medium text-xl line-clamp-2">
            {user.name}
          </h1>
          <p className="text-dark-grey">@{user.username}</p>
        </div>
        
    </Link>

    ) :''
    }
     
     </>
    )
}

export default UserCard