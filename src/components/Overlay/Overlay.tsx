// import { IconUser } from "@tabler/icons-react"
// import clsx from "clsx"
// import { useContext } from "react";
import { SpriteData } from "../../App";
import { UploadButton } from "./UploadButton";


export const Overlay = (props: {addSprite : (data: SpriteData) => void}) => {
    // const { theme } = useContext(ThemeContext);

    return (
    <div className="absolute w-full h-full z-10">
        <div className="absolute left-0 bottom-0">
            <div className="flex flex-col m-4 gap-4">
                {/* <IconUser size={40} className={clsx(
                                                    theme === "dark" && "text-neutral-700 hover:text-neutral-100",
                                                    theme === "light" && "text-neutral-400 hover:text-neutral-900",
                                                    "transition-colors cursor-pointer")}/> */}
                <UploadButton addSprite={props.addSprite}/>
            </div>
        </div>
    </div>
    )
}