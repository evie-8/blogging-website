import React, { useContext } from "react"
import { EditContext } from "./edit-page"

interface Props {
    tag: String;
    index: number;
}

const Tag: React.FC<Props> = ({
    tag,
    index
}) => {

    let {blog, blog:{tags}, setBlog} = useContext(EditContext);


    const deleteTag = () => {
        tags = tags.filter(t => t !== tag);

        setBlog({...blog, tags})

    }


    const tagEdit = (event: any) => {
        event.target.setAttribute("contentEditable", true);
        event.target.focus();
    }
    const keyDown = (event: any) => {
        if (event.keyCode == 13 || event.keyCode == 188) {
            event.preventDefault();
            const current = event.target.innerText;
            tags[index] = current
            setBlog({...blog, tags});
            event.target.setAttribute("contentEditable", false);
      
        }

    }
  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
        <p className="outline-none" onClick={tagEdit} onKeyDown={keyDown} contentEditable="true">
            {tag}
        </p>
        <button className="mt-[2px] rounded-full absolute right-3 top-4 -translate-y-1/2"
        onClick={deleteTag}>
            <i className="fi fi-rr-cross text-[8px] pointer-events-none"></i>
        </button>
    </div>
  )
}

export default Tag 