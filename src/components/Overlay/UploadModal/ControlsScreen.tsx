import { useEffect, useState } from 'react'
import { SpriteState } from './UploadModal'
import { CollisionDetection, DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, rectIntersection, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { Draggable } from '../../Draggable'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import Droppable from '../../Droppable'
import { v4 } from 'uuid';
import * as HoverCard from '@radix-ui/react-hover-card';
import clsx from 'clsx'
import { IconCheck } from '@tabler/icons-react'
import { SpriteData } from '../../../App'


interface ControlsScreenProps {
    spriteStates: SpriteState[]
    imageFiles: {data: File, url: string}[]
    addSprite : (data: SpriteData) => void
}

const ControlsScreen = (props: ControlsScreenProps) => {
    const { spriteStates, imageFiles, addSprite } = props;
    const [draggingUuid, setDraggingUuid] = useState<string>();
    const [animationMap, setAnimationMap] = useState<Map<string,SpriteState>>(new Map());
    const [valid, setValid] = useState<boolean>(true);
    const [direction, setDirection] = useState<"RIGHT" | "LEFT">("RIGHT");

    useEffect(() => {
        setValid(animationMap.has("IDLE"))
    },[animationMap])


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
        setDraggingUuid(event.active.data.current?.uuid)
    }
    
    const handleImageDragEnd = (event : DragEndEvent) => {
        let dropState = spriteStates.find(state => state.uuid ===  event.active.id)
        if(!event.over?.id || !dropState) return;
        let tempAnimationMap = animationMap
        tempAnimationMap.set(event.over?.id as string, dropState)
        setAnimationMap(new Map(tempAnimationMap))
        setDraggingUuid(undefined)
    }

    const ImageListDisplay = () => {
        return (
            <>
            {spriteStates.map((spriteState) => {
                return (
                    <Draggable key={`controls_card_${spriteState.uuid}`} id={`${spriteState.uuid}`} data={{uuid:spriteState.uuid}}>
                        <div className={`border rounded shadow p-1 w-[10vh] h-full transition-colors hover:bg-neutral-100`}
                        onMouseDown={(e) => setDraggingUuid(spriteState.uuid)}>
                            <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={imageFiles[spriteState.images[0].index].url}/>
                            <div className="text-neutral-700 text-xs overflow-hidden text-ellipsis text-nowrap text-center flex-1">
                                {spriteState.name}
                            </div>
                        </div>
                    </Draggable>
                )
            })}
          </>
        )
    }

    const SpriteDroppable = (props: {uuid: string}) => {
        const {uuid} = props;
        return (
            <div className='w-[12vh] h-[15vh]'>
                <Droppable uuid={uuid}>
                    {animationMap?.has(uuid) && 
                        <div className={`relative border rounded shadow p-1 max-w-20 w-20 h-[12vh] transition-colors bg-neutral-200`}>
                            <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={imageFiles[animationMap.get(uuid)!.images[0].index].url}/>
                            <div className="text-neutral-700 text-sm overflow-hidden text-ellipsis text-nowrap text-center flex-1">
                                {animationMap.get(uuid)?.name}
                            </div>
                        </div>}
                </Droppable>
            </div>
        )
    }


    const submit = () => {
        if(!animationMap.get("IDLE")) return;

        let data: SpriteData = {
            uuid: v4(),
            direction: direction,
            states: {
                "IDLE": {fps: animationMap.get("IDLE")!.fps, frames: animationMap.get("IDLE")?.images.map(({index}) => imageFiles[index].url) || []},
                "RUN": animationMap.get("RUN") && {fps: animationMap.get("RUN")!.fps, frames: animationMap.get("RUN")?.images.map(({index}) => imageFiles[index].url) || []},
                "JUMP": animationMap.get("JUMP") && {fps: animationMap.get("JUMP")!.fps, frames: animationMap.get("JUMP")?.images.map(({index}) => imageFiles[index].url) || []},
                "DASH": animationMap.get("DASH") && {fps: animationMap.get("DASH")!.fps, frames: animationMap.get("DASH")?.images.map(({index}) => imageFiles[index].url) || []},
                "ATTACK": animationMap.get("ATTACK") && {fps: animationMap.get("ATTACK")!.fps, frames: animationMap.get("ATTACK")?.images.map(({index}) => imageFiles[index].url) || []},
            }
        }

        addSprite(data)
    }

  return (
    <DndContext collisionDetection={fixCursorSnapOffset} sensors={sensors} onDragStart={handleImageDragStart} onDragEnd={handleImageDragEnd}>
        <div className='flex h-full w-full flex-col'>
            <div className='w-full h-[80%] text-neutral-500 overflow-auto relative flex justify-center'>


                <div className='flex items-center h-full justify-around w-[80%]'>
                    <div className="flex flex-col h-full items-start justify-center gap-6">
                        <div className="flex gap-6">
                            <div className='flex flex-col gap-2 items-center'>
                                Jump
                                <SpriteDroppable uuid={"JUMP"}/>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className='flex flex-col gap-2 items-center'>
                                <SpriteDroppable uuid={"IDLE"}/>
                                Idle
                            </div>

                            <div className='flex flex-col gap-2 items-center'>
                                <SpriteDroppable uuid={"RUN"}/>
                                Walk
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2 items-center'>
                            Dash
                            <SpriteDroppable uuid={"DASH"}/>
                        </div>
                        <div className='flex flex-col gap-2 items-center'>
                            Attack
                            <SpriteDroppable uuid={"ATTACK"}/>
                        </div>
                    </div>

                </div>


                {/* <div className='w-full flex flex-col items-center gap-2 p-2'>
                {controls.map((control) => {
                    return (
                        <div className='flex w-full h-[15vh] items-center justify-between'>
                            <div className='flex h-full items-center gap-2'>
                                <Droppable uuid={control.uuid + "_left"}>
                                    <></>
                                </Droppable>
                            </div>
                            <div className='text-xl'>
                                {control.name}
                            </div>
                            <div className='flex h-full items-center gap-2'>
                                <Droppable uuid={control.uuid + "_right"}>
                                    <></>
                                </Droppable>
                            </div>

                        </div>
                    )
                })}
                </div> */}
            </div>
            <div className='flex justify-center w-full h-[20%] min-h-[75px] border gap-2'>
                <div className='flex h-full max-h-full justify-center w-full'>
                    <ImageListDisplay/>
                </div>
                <div className='flex items-center'>
                    <HoverCard.Root>
                        <HoverCard.Trigger >
                            <div className={clsx('group flex items-center justify-center border rounded shadow min-h-12 h-12 min-w-12 w-12 mb-2 mx-2',
                                                valid ? "hover:bg-neutral-200 cursor-pointer" : "cursor-not-allowed")}
                                                >
                                <IconCheck size={30} 
                                    className={clsx("text-neutral-300",
                                    valid && "text-red-300 group-hover:text-red-600 group-hover:text-neutral-700")
                                    }
                                    onClick={submit}
                                />
                            </div>
                        </HoverCard.Trigger>
                        {!valid &&
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
        </div>
        <DragOverlay modifiers={[snapCenterToCursor]}>
            {draggingUuid ? (
                <div className={`relative border rounded shadow p-1 max-w-20 w-20 h-full transition-colors bg-neutral-200`}>
                    <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={imageFiles[spriteStates.find(state => state.uuid === draggingUuid)!.images[0].index].url}/>
                    <div className="text-neutral-700 text-sm overflow-hidden text-ellipsis text-nowrap text-center flex-1">
                        {spriteStates.find(state => state.uuid === draggingUuid)?.name}
                    </div>
                </div>
            ): null}
        </DragOverlay>
    </DndContext>
  )
}

export default ControlsScreen