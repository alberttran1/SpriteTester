import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@radix-ui/react-progress';

import { IconUpload } from '@tabler/icons-react';
import { v4 } from 'uuid';
import MultiUploadScreen from './MultiUploadScreen';
import ControlsScreen from './ControlsScreen';
import { SpriteData } from '../../../App';
import * as DefaultSprite from "../../../assets/DefaultSprite/index"
import { DotLoader, FadeLoader } from 'react-spinners';

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
    const [loading, setLoading] = useState<boolean>(false)
    const [spriteStates, setSpriteStates] = useState<SpriteState[]>([
        {name: "Animation 1", fps: 6, images: [], uuid : v4()},
    ])
    
    const onDropSpriteSheet = useCallback((acceptedFiles : File[]) => {
        console.log(acceptedFiles)
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


    const UploadDefaults = async () => {
        let fArr : {data: File, url: string}[] = []
        const defaultImageFiles = [
            {file: DefaultSprite.idle1, name: "idle1.jpeg"},
            {file: DefaultSprite.idle2, name: "idle2.jpeg"},
            {file: DefaultSprite.idle3, name: "idle3.jpeg"},
            {file: DefaultSprite.idle4, name: "idle4.jpeg"},
            {file: DefaultSprite.idle5, name: "idle5.jpeg"},
            {file: DefaultSprite.jump1, name: "jump1.jpeg"},
            {file: DefaultSprite.jump2, name: "jump2.jpeg"},
            {file: DefaultSprite.jump3, name: "jump3.jpeg"},
            {file: DefaultSprite.jump4, name: "jump4.jpeg"},
            {file: DefaultSprite.jump5, name: "jump5.jpeg"},
            {file: DefaultSprite.run1, name: "run1.jpeg"},
            {file: DefaultSprite.run2, name: "run2.jpeg"},
            {file: DefaultSprite.run3, name: "run3.jpeg"},
            {file: DefaultSprite.run4, name: "run4.jpeg"},
            {file: DefaultSprite.run5, name: "run5.jpeg"},
            {file: DefaultSprite.run6, name: "run6.jpeg"},
            {file: DefaultSprite.run7, name: "run7.jpeg"},
        ]

        setLoading(true)

        for (const data of defaultImageFiles) {
            let res = await fetch(data.file)
            let blob = await res.blob()
            const contentType = res.headers.get('content-type')!

            let file =  new File([blob],data.name, {type: contentType})
            console.log(file)
            fArr.push({data: file,url: URL.createObjectURL(file)});
        }

        setLoading(false)
        setImageFiles(fArr)
        setModalState("MULTIIMAGE");
    }

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
                            <div className="flex flex-col gap-2 items-center">
                                <IconUpload size={64} stroke={1}/>
                                <div className="text-base mt-4 max-w-[75%] text-center">
                                    Drop a single sprite sheet / multiple images here or click to upload.
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className={`h-full flex justify-center items-center h-full 
                                            border text-neutral-400 text-2xl hover:bg-neutral-200 
                                            hover:text-neutral-600 hover:border-neutral-600 
                                            transition-colors cursor-pointer rounded border-dashed`}
                            onClick={(UploadDefaults)}>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="text-base mt-4 max-w-[75%] w-60 text-center flex justify-center items-center">
                                {loading ?
                                    <FadeLoader/>
                                :
                                    <div>
                                        Just want to try the app? Click here to use the default sprite package
                                    </div>    
                                }
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