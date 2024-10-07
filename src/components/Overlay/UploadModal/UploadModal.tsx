import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import * as Dialog from '@radix-ui/react-dialog';
import { IconUpload } from '@tabler/icons-react';
import { v4 } from 'uuid';
import MultiUploadScreen from './MultiUploadScreen';
import ControlsScreen from './ControlsScreen';
import { SpriteData } from '../../../App';

type ModalState = "UPLOAD" | "SPRITESHEET" | "MULTIIMAGE" | "CONTROLS"

export interface SpriteState {
    images : {index: number, uuid: string}[]
    name: string
    fps: number
    uuid: string
}

const UploadModal = (props: {addSprite : (data: SpriteData) => void}) => {
    const [imageFiles, setImageFiles] = useState<{data: File, url: string}[]>([])
    const [modalState, setModalState] = useState<ModalState>("UPLOAD")
    const [spriteStates, setSpriteStates] = useState<SpriteState[]>([
        {name: "Animation 1", fps: 6, images: [], uuid : v4()},
    ])
    
    const onDropSpriteSheet = useCallback((acceptedFiles : File[], errors : any[]) => {
        const multiDrop = acceptedFiles.length >= 2;
        setImageFiles(acceptedFiles.map((file) => {
            return {data: file, url: URL.createObjectURL(file)}
        }))
        if(multiDrop) {
            setModalState("MULTIIMAGE");
        } else {
            setModalState("SPRITESHEET")
        }
    }, [])

    const {getRootProps : rootSpriteSheetDrop, getInputProps : inputSpriteSheetDrop, isDragActive : spriteSheetDragActive} = useDropzone({onDrop: onDropSpriteSheet, accept:{"image/png": [".png"],"image/jpg": [".jpg"], "image/jpeg": [".jpeg"]}})

    if(modalState === "UPLOAD") {
        return (                
                <div className="flex flex-col items-center justify-center h-full">
                    <Dialog.Title className="text-4xl text-neutral-600 ">Sprite Upload</Dialog.Title>
                    <div className="flex items-center justify-center h-full w-full m-4">

                        <div {...rootSpriteSheetDrop({className:"w-full h-full m-4"})}>
                            <div className={`flex justify-center items-center w-full h-full 
                                            border text-neutral-400 text-2xl hover:bg-neutral-200 
                                            hover:text-neutral-600 hover:border-neutral-600 
                                            transition-colors cursor-pointer rounded border-dashed`}
                                style={{borderColor: spriteSheetDragActive ? "blue" : 'inherit'}}>
                            <input {...inputSpriteSheetDrop({accept:"image/*"})} />
                            <div className="flex flex-col gal-2 items-center">
                                <IconUpload size={64} stroke={1}/>
                                <div className="text-base mt-4 max-w-[75%] text-center">
                                    Drop a single sprite sheet / multiple images here or click to upload.
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    } if (modalState === "MULTIIMAGE") {
        return (
            <MultiUploadScreen spriteStates={spriteStates} setSpriteStates={setSpriteStates} imageFiles={imageFiles} setNextState={() => setModalState("CONTROLS")}/>
        )
    } if (modalState === "CONTROLS") {
        return (
            <ControlsScreen spriteStates={spriteStates} imageFiles={imageFiles} addSprite={props.addSprite}/>
        )
    }
    return null;
}

export default UploadModal