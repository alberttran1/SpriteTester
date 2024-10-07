// import { IconUser } from "@tabler/icons-react"
// import clsx from "clsx"
// import { useContext } from "react";
import { useState } from "react";
import { SpriteData } from "../../App";
import { UploadButton } from "./UploadButton";
import banner from "../../assets/banner.png"
import clickHere from "../../assets/click_here.png"
import dude from "../../assets/dude.png"


export const Overlay = (props: {addSprite : (data: SpriteData) => void}) => {
    // const { theme } = useContext(ThemeContext);
    const [showBanner, setShowBanner] = useState<boolean>(true);

    return (
    <div className="absolute w-full h-full z-10">
        {showBanner &&
            <>
                <div className="w-full h-full flex items-center justify-center animate-fadeInSlow">
                    <div className="absolute top-[20%] flex flex-col justify-center items-center">
                        <img className="w-[500px]" src={banner}/>
                        <img className="" src={dude}/>
                    </div>
                </div>

                <div className="absolute left-[20px] bottom-[50px] animate-fadeInSlowDelay">
                    <img className="animate-bounce w-[70%]" src={clickHere}/>
                </div>
            </>
        }
        <div className="absolute left-0 bottom-0">

            <div className="flex flex-col m-4 gap-4">
                {/* <IconUser size={40} className={clsx(
                                                    theme === "dark" && "text-neutral-700 hover:text-neutral-100",
                                                    theme === "light" && "text-neutral-400 hover:text-neutral-900",
                                                    "transition-colors cursor-pointer")}/> */}

                <UploadButton addSprite={props.addSprite} removeBanner={() => setShowBanner(false)}/>
            </div>
        </div>
    </div>
    )
}