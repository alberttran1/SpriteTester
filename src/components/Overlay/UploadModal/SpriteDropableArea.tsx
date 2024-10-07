import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy,} from '@dnd-kit/sortable';
import clsx from 'clsx';
import { useState } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { SpriteState } from './UploadModal';
import { SortableImageCard } from './SortableImageCard';


interface SpriteDropableAreaProps {
    state : SpriteState
    selected : boolean
    setSelected : () => void
    removeImage: (innerIndex: number) => void;
    imageFiles : {data: File, url: string}[]
    setStateName : (name: string) => void;
    setStateFPS: (val: number) => void;
    deleteState: () => void;
}

const SpriteDropableArea = (props : SpriteDropableAreaProps) => {
    const {state, selected, setSelected, removeImage, imageFiles, setStateName, setStateFPS, deleteState} = props;
    const [title, setTitle] = useState<string>(state.name)
    const [fps, setFPS] = useState<number>(state.fps)
    const { setNodeRef, isOver } = useDroppable({
        id : state.uuid
    });


    const handleNameChange = (name : string) => {
        if(name === "") {
            setTitle(state.name)
            return;
        }
        else setStateName(name)
    }

    const handleFPSChange = (val : number) => {
        if(Number.isNaN(val)) {
            setFPS(val)
        }
        else if(val < 1) {
            setFPS(1)
            setStateFPS(1)
        }
        else if(val > 99) {
            setFPS(99)
            setStateFPS(99)
        } 
        else {
            setFPS(val)
            setStateFPS(val)
        }
    }

    const handleFPSBlur = (val : number) => {
        if(Number.isNaN(val)) setStateFPS(1);
    }

  return (
    <div className={clsx("border rounded shadow min-h-32 h-32 w-full px-2 pt-1 cursor-pointer",
                        selected ? "bg-neutral-100" : "hover:bg-neutral-50")}
            onClick={setSelected}>
        <div className='flex justify-between'>
            <input className="bg-transparent" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => handleNameChange(title)}/>
            <div className='flex gap-1'>
                FPS
                <input type="number" min={1} max={99} className="w-12 rounded text-center bg-white" value={fps} onChange={(e) => handleFPSChange(parseInt(e.target.value))} onBlur={(e) => handleFPSBlur(parseInt(e.target.value))}/>
                <IconTrash className="text-neutral-200 hover:text-red-500" onClick={() => deleteState()}/>
            </div>
        </div>
        <div className='h-24 min-h-[75px] flex gap-2 overflow-scroll'>
            <SortableContext
                id={state.uuid}
                items={state.images.map((imageData) => imageData.uuid)}
                strategy={horizontalListSortingStrategy}>
                    <div className={`m-2 ${isOver ? "border border-dotted border-2 border-indigo-600" : `${state.images.length === 0 ? "border border-dotted border-2": ""}`} p-1 pr-20 w-full flex gap-1`} ref={setNodeRef}>
                                {state.images.length === 0 
                                ?
                                    <div className='flex items-center justify-center w-full h-full text-center text-neutral-400'>
                                        Drag images here
                                    </div>
                                :
                                state.images.map((imageData,index) => (
                                        <SortableImageCard
                                            key={`${state.uuid}_${index}`} 
                                            index={imageData.index}
                                            id={imageData.uuid}
                                            containerId={state.uuid}
                                            delete={() => removeImage(index)}
                                            fileData={imageFiles[imageData.index]}/>
                                    ))
                                }
                    </div>
            </SortableContext>
        </div>
    </div>
    )
}

export default SpriteDropableArea