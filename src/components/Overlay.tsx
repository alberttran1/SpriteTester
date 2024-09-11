import { IconUser, IconUserPlus } from "@tabler/icons-react"



export const Overlay = () => {
    return (
    <div className="border w-full h-full">
        <div className="absolute border left-0 bottom-0">
            <div className="flex flex-col m-4 gap-4">
                <IconUser size={40} className="text-neutral-700 hover:text-neutral-100 transition-colors cursor-pointer"/>
                <IconUserPlus size={40} className="text-neutral-700 hover:text-neutral-100 transition-colors cursor-pointer"/>
            </div>
        </div>
    </div>
    )
}