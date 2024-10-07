import { CollisionDetection, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import React, { useEffect, useRef, useState } from 'react'
import SpriteDisplay from '../../SpriteDisplay';
import { SpriteState } from './UploadModal';
import { Draggable } from '../../Draggable';
import { arrayMoveImmutable } from 'array-move';
import { v4 } from 'uuid';
import SpriteDropableArea from './SpriteDropableArea';
import { IconCheck, IconPlus } from '@tabler/icons-react';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import * as HoverCard from '@radix-ui/react-hover-card';
import clsx from 'clsx';

interface MultiUploadScreenProps {
    spriteStates: SpriteState[]
    setSpriteStates: ( state: SpriteState[]) => void
    imageFiles: {data: File, url: string}[]
    setNextState: () => void;
}

const MultiUploadScreen = (props: MultiUploadScreenProps) => {
    const {spriteStates, setSpriteStates, imageFiles, setNextState} = props
    const [draggingIndex, setDraggingIndex] = useState<number>(-1)
    const [draggingMain, setDraggingMain] = useState<boolean>(false);
    const [selectedState, setSelectedState] = useState<number>(-1)
    const [dropPreviewData, setDropPreviewData] = useState<{containerId: String, index: number, active: number}>()
    const [selectedIndices,setSelectedIndices] = useState<number[]>([])
    const [anchorSelectedIndices, setAnchorSelectedIndices] = useState<number[]>([])
    const [anchorIndex, setAnchorIndex] = useState<number>(0)
    const [validStates, setValidStates] = useState<boolean>(false)

    const allSelectedIndices = [...new Set([...selectedIndices, ...anchorSelectedIndices])]

    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        window.addEventListener("click", clickOff)

        return(() => {
            window.removeEventListener("click", clickOff)
        })
    },[])

    useEffect(() => {
        setValidStates(!spriteStates.some(state => state.images.length === 0) && !spriteStates.some((state,index) => index !== spriteStates.findIndex(innerState => innerState.name === state.name)))
    },[spriteStates])

    const clickOff = (e : MouseEvent) => {
        if(!listRef.current?.contains(e.target as Node)) {
            setSelectedIndices([])
            setAnchorSelectedIndices([])
        }
    }

    const imagesOnClick = (e : React.MouseEvent, index : number) => {
        if(e.shiftKey) {
            const smaller = Math.min(index,anchorIndex)
            const bigger = Math.max(index,anchorIndex)
            let newIndices = []
            for(let i = smaller; i <= bigger; ++i) {
                newIndices.push(i)
            }
            newIndices = [...new Set(newIndices)]
            setAnchorSelectedIndices(newIndices)
        } else if (e.altKey) {
            setSelectedIndices([...new Set([...selectedIndices, ...anchorSelectedIndices, index])])
            setAnchorIndex(index)
        } else {
            if(allSelectedIndices.includes(index)) return;
            setSelectedIndices([index])
            setAnchorSelectedIndices([])
            setAnchorIndex(index)
        }
    }

    const fixCursorSnapOffset: CollisionDetection = (args) => {
        // Bail out if keyboard activated
        if (!args.pointerCoordinates) {
          return rectIntersection(args);
        }
        const { x, y } = args.pointerCoordinates;
        const { width, height } = args.collisionRect;
        const updated = {
          ...args,
          // The collision rectangle is broken when using snapCenterToCursor. Reset
          // the collision rectangle based on pointer location and overlay size.
          collisionRect: {
            width,
            height,
            bottom: y + height / 2,
            left: x - width / 2,
            right: x + width / 2,
            top: y - height / 2,
          },
        };
        return rectIntersection(updated);
      };

    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
          distance: 10,
        },
    });

    const sensors = useSensors(
        mouseSensor,
    );

    const handleImageDragStart = (event : DragStartEvent) => {
        setDraggingMain(event.active.data.current?.isMain)
        setDraggingIndex(event.active.data.current?.index)
    }

    const handleImageDragOver = (event : DragOverEvent) => {
        const { over, active} = event;

        if(active.data.current?.index === undefined) return;

        if(over?.data.current?.sortable) {
            setDropPreviewData({containerId: over?.data.current?.sortable.containerId, index: over?.data.current?.sortable.index, active: active.data.current?.index})
        } else if (over?.id){
            setDropPreviewData({containerId: over?.id.toString(), index: spriteStates.find(state => state.uuid === over?.id)!.images.length, active: active.data.current?.index})
        } else {
            setDropPreviewData(undefined)
        }
    }

    const setStateAttribute = (attribute: string, stateUuid: string, value: any) => {
        const stateIndex = spriteStates.findIndex(state => state.uuid === stateUuid);
        if(stateIndex === -1) return;
        let newSpriteState = spriteStates
        newSpriteState[stateIndex] = {...newSpriteState[stateIndex], [attribute]: value}
        setSpriteStates([...newSpriteState])
    }
    const deleteState = (stateUuid: string) => {
        const newState = spriteStates.filter(state => state.uuid !== stateUuid)
        setSpriteStates([...newState])
    }

    const ImageListDisplay = (props : {images : {data: File, url: string}[]}) => {
        const {images} = props;
        return (
            <>
            {images.map((image,index) => {
                const selected = allSelectedIndices.includes(index)
                return (
                    <Draggable key={`imagesMap_${index}`} id={`images_${index}`} data={{index: index, isMain: true}}>
                        <div className={`border rounded shadow p-1 w-[10vh] h-full transition-colors ${selected ? "bg-neutral-200" : "hover:bg-neutral-100"}`}
                        onMouseDown={(e) => imagesOnClick(e,index)}>
                            <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={image.url}/>
                            <div className="text-neutral-700 text-sm overflow-hidden text-ellipsis flex-1">
                                {image.data.name}
                            </div>
                        </div>
                    </Draggable>
                )
            })}
          </>
        )
    }
    
    const handleImageDragEnd = (event : DragEndEvent) => {
        const { over, active } = event;
        
        const newSpriteStates = spriteStates;

        setSelectedIndices([])
        setAnchorSelectedIndices([])

        //reorder
        if(active.data.current?.sortable && over?.data.current?.sortable
            && active.data.current?.sortable.containerId === over?.data.current?.sortable.containerId ) {
                
            const arrayIndex = spriteStates.findIndex(state => state.uuid === active.data.current?.sortable.containerId)
            const newImageArray = arrayMoveImmutable(newSpriteStates[arrayIndex]?.images,active.data.current.sortable.index,over.data.current.sortable.index)
            newSpriteStates[arrayIndex] = {...newSpriteStates[arrayIndex], images: newImageArray}

            setSpriteStates([...newSpriteStates]);
            setDraggingIndex(-1);
            return;
        }

        //move
        const selectedIds = active.data.current?.isMain ? allSelectedIndices : [active.data.current?.index]

        const dropStateUuid = over?.data.current?.sortable ? over.data.current.sortable.containerId :  over?.id

        setSelectedState(spriteStates.findIndex(state => state.uuid === dropStateUuid))

        const fromState = spriteStates.find(state => state.uuid === active.data.current?.sortable.containerId)
        const dropState = spriteStates.find(state => state.uuid === dropStateUuid)

        const fromStateIndex = spriteStates.findIndex(state => state.uuid === active.data.current?.sortable.containerId);
        const dropStateIndex = spriteStates.findIndex(state => state.uuid === dropStateUuid);


        const tempSpriteStates = spriteStates
        if(fromState) {
            fromState.images.splice(active.data.current?.sortable.index,1)
            tempSpriteStates[fromStateIndex] = fromState;
        }

        if(dropState) {
            let dropIndex = over?.data.current?.sortable ? over?.data.current?.sortable.index : dropState.images.length
            dropState.images.splice(dropIndex,0,...allSelectedIndices.sort((a,b) => a - b).map(id => ({index: id, uuid: v4()})))
            tempSpriteStates[dropStateIndex] = dropState;
        }

        setSpriteStates([...tempSpriteStates])
        setDraggingIndex(-1)
    }

  return (
            <DndContext collisionDetection={fixCursorSnapOffset} sensors={sensors} onDragStart={handleImageDragStart} onDragOver={handleImageDragOver} onDragEnd={handleImageDragEnd}>
                <div className='flex h-full flex-col'>
                    <div className='flex flex-1 h-[80%]'>
                        <div className='flex flex-col rounded border w-[30%] p-2 m-2 relative'>
                            {spriteStates[selectedState]?.images.length > 0 ?
                                <SpriteDisplay fps={spriteStates[selectedState].fps} imageFiles={spriteStates[selectedState]?.images.map((imageData) => imageFiles[imageData.index].url)}/>
                                :
                                <div className='flex items-center align-center text-center h-full text-neutral-500'>
                                    Seperate your images into keyframe animations. 
                                    Then, click the check when you're ready to create your character!
                                </div>
                            }
                        </div>  
                        <div className={`m-2 p-2 rounded border relative flex flex-col gap-2 ml-1 flex-1 overflow-scroll text-neutral-900 font-sans font-lg font-semibold`}>
                            Keyframe Animations
                            {spriteStates.map((state : SpriteState, index) => 
                                <SpriteDropableArea
                                    key={`SpriteDropArea_${state.uuid}`} 
                                    selected={selectedState === index} 
                                    setSelected={() => setSelectedState(index)} 
                                    removeImage={(innerIndex : number) => {
                                        const tempSpriteStates = spriteStates
                                        tempSpriteStates[index].images.splice(innerIndex,1);
                                        setSpriteStates([...tempSpriteStates])
                                    }}
                                    setStateName={(name) => setStateAttribute("name",state.uuid,name)}
                                    setStateFPS={(val) => setStateAttribute("fps",state.uuid,val)}
                                    state={state} 
                                    imageFiles={imageFiles} 
                                    deleteState={() => deleteState(state.uuid)}/>
                            )}
                            <div className='flex justify-between'>
                                <div className='group flex items-center justify-center border rounded shadow min-h-10 h-10 w-10 mb-2 hover:bg-neutral-200 cursor-pointer'
                                    onClick={() => setSpriteStates([...spriteStates,{name: "New State", fps: 6, images: [], uuid: v4()}])}>
                                        <IconPlus size={30} className="text-neutral-300 group-hover:text-neutral-700"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex h-[20%] min-h-[75px]'>
                        <div ref={listRef} className=' flex gap-2 overflow-scroll'>
                            <ImageListDisplay images={imageFiles}/>
                        </div>
                        <div className='flex items-center'>
                            <HoverCard.Root>
                                <HoverCard.Trigger >
                                    <div className={clsx('group flex items-center justify-center border rounded shadow min-h-12 h-12 min-w-12 w-12 mb-2 mx-2',
                                                        validStates ? "hover:bg-neutral-200 cursor-pointer" : "cursor-not-allowed")}
                                        onClick={validStates ? setNextState : undefined}>
                                        <IconCheck size={30} 
                                            className={clsx("text-neutral-300",
                                                        validStates && "text-red-300 group-hover:text-red-600 group-hover:text-neutral-700")
                                        }/>
                                    </div>
                                </HoverCard.Trigger>
                                {!validStates &&
                                <HoverCard.Portal>
                                    <HoverCard.Content avoidCollisions>
                                        <HoverCard.Arrow className="fill-white" />
                                        <div className="rounded p-2 w-64 bg-white shadow animate-fadeIn text-neutral-500">
                                            All states must have images and unique names to continue!
                                        </div>
                                    </HoverCard.Content>
                                </HoverCard.Portal>
                                }
                            </HoverCard.Root>
                        </div>
                    </div>

                    <DragOverlay modifiers={[snapCenterToCursor]}>
                        {draggingIndex > -1 ? (
                            <div className={`relative border rounded shadow p-1 max-w-20 w-20 h-full transition-colors bg-neutral-200`}>
                                <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={imageFiles[draggingIndex].url}/>
                                <div className="text-neutral-700 text-sm overflow-hidden text-ellipsis flex-1">
                                {imageFiles[draggingIndex].data.name}
                                </div>
                                {draggingMain && allSelectedIndices.length > 1 &&
                                    <div className='absolute top-0 right-0 rounded-xl h-6 w-6 border bg-red-50 -translate-y-1/2 translate-x-1/2 text-center text-sm text-neutral-900'>
                                        {allSelectedIndices.length}
                                    </div>
                                }
                            </div>
                        ): null}
                    </DragOverlay>
                </div>
            </DndContext>
  )
}

export default MultiUploadScreen