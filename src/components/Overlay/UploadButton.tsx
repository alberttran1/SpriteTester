import * as Dialog from '@radix-ui/react-dialog';
import { IconUserPlus } from '@tabler/icons-react';
import clsx from 'clsx';
import { useContext, useState } from 'react';
import { SpriteData, ThemeContext } from '../../App';
import UploadModal from './UploadModal/UploadModal';

//  object Sprite {
//     states: states[]
//     keyBinds: keyBind[]
// }

// object State {
//     images: img[]
//     frameRate: number
// }


export const UploadButton = (props: {addSprite : (data: SpriteData) => void}) => {
    const { theme } = useContext(ThemeContext);
    const [open, setOpen] = useState<boolean>();

    const addSpriteConfirm = (data: SpriteData) => {
            props.addSprite(data)
            setOpen(false)
    }

    return (
        <Dialog.Root open={open}>
            <Dialog.Trigger asChild>
                <IconUserPlus size={40} className={clsx(
                    theme === "dark" && "text-neutral-700 hover:text-neutral-100",
                    theme === "light" && "text-neutral-400 hover:text-neutral-900",
                    "transition-colors cursor-pointer")}/>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed bg-gray-700 opacity-50 inset-0 animate-modalOverlayAppear"/>
                <Dialog.Content className="bg-white fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[65vh] p-6 rounded min-w-[600px] shadow-none animate-modalAppear">
                    <UploadModal addSprite={addSpriteConfirm}/>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}