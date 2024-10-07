import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { SpriteData, ThemeContext } from "../App";
import SpriteDisplay from "./SpriteDisplay";


interface PlaygroundProps {
    activeSprites: {spriteType: SpriteData, uuid: string}[];
}

interface InstanceData {
    curFrame: number;
    curState: "IDLE" | "RUN" | "JUMP" | "DASH" | "ATTACK"
    x: number;
    y: number;
    moveVec: {
        x: number;
        y: number;
    }
    onGround: boolean;
    direction: "RIGHT" | "LEFT"
}


export const Playground = (props: PlaygroundProps) => {
    const { activeSprites } = props;
    const { theme } = useContext(ThemeContext);
    const [inTimeSlice, setInTimeSlice] = useState<boolean>(false);
    const [instanceMap, setInstanceMap] = useState<Map<string,InstanceData>>(new Map());
    const [keysDown, setKeysDown] = useState<string[]>([]);
    
    const gravity = 1;
    const jumpForce = 25;
    const runSpeed = 10;
    const frameRate = 60;

    const controls = ["KeyA","KeyS","KeyD","KeyW","ArrowUp","ArrowRight","ArrowDown","ArrowLeft","Space"]


    const onKeyDown = (e : KeyboardEvent) => {
        if(controls.includes(e.code) && !keysDown.includes(e.code)) {
            setKeysDown([...keysDown,e.code])
        }
    }

    const onKeyUp = (e : KeyboardEvent) => {
        // console.log("hello", keysDown, e.code, keysDown.findIndex(code => code === e.code),keysDown, [...keysDown.splice(0, 1)])
        if(controls.includes(e.code) && keysDown.includes(e.code)) {
            let tempKeys = keysDown
            tempKeys.splice(keysDown.findIndex(code => code === e.code), 1)
            setKeysDown([...tempKeys])
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)

        return(() => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        })
    },[keysDown])

    useEffect(() => {
        let tempInstanceMap = instanceMap;
        const newInstanceData : InstanceData = {
            curFrame: 0,
            curState: "IDLE",
            x: 100,
            y: 100,
            moveVec: {
                x: 0,
                y: 0,
            },
            onGround: false,
            direction: "RIGHT",
        }
        activeSprites.forEach(data => {
            if(!tempInstanceMap.has(data.uuid)) {
                tempInstanceMap.set(data.uuid,newInstanceData)
            }
        });
        setInstanceMap(new Map(tempInstanceMap))
    },[activeSprites])


    const update = () => {
        let tempInstanceMap = instanceMap;

        activeSprites.forEach((data) => {
            let tempInstance = tempInstanceMap?.get(data.uuid)!
            tempInstance.moveVec.x = 0

            if(tempInstance.y <= 0) {
                tempInstance.onGround = true;
            }

            if(!tempInstance.onGround) {
                tempInstance.moveVec.y -= gravity;
            } else {
                tempInstance.moveVec.y = 0;
            }
            
            keysDown.forEach(key => {
                if((key === "KeyW" || key === "ArrowUp" || key === "Space") && tempInstance.onGround) {
                    tempInstance.moveVec.y = jumpForce;
                    tempInstance.onGround = false;
                }
                else if(key === "KeyA" || key === "ArrowLeft") {
                    tempInstance.moveVec.x -= runSpeed;
                    tempInstance.direction = "LEFT"
                }
                else if(key === "KeyD" || key === "ArrowRight") {
                    tempInstance.moveVec.x += runSpeed
                    tempInstance.direction = "RIGHT"
                }
            })

            tempInstance.x += tempInstance.moveVec.x
            tempInstance.y += tempInstance.moveVec.y

            if(tempInstance.curState === "IDLE") {
                if(tempInstance.moveVec.x !== 0) {
                    tempInstance.curState = "RUN"
                    tempInstance.curFrame = 0
                } if(tempInstance.y > 0) {
                    tempInstance.curState = "JUMP"
                    tempInstance.curFrame = 0
                }
            }

            if(tempInstance.curState === "RUN") {
                if(tempInstance.moveVec.x === 0) {
                    tempInstance.curState = "IDLE"
                    tempInstance.curFrame = 0
                } if(tempInstance.y > 0) {
                    tempInstance.curState = "JUMP"
                    tempInstance.curFrame = 0
                }
            }

            if(tempInstance.curState === "JUMP") {
                if(tempInstance.y <= 0) {
                    if(tempInstance.moveVec.x !== 0) {
                        tempInstance.curState = "RUN"
                        tempInstance.curFrame = 0
                    } else {
                        tempInstance.curState = "IDLE"
                        tempInstance.curFrame = 0
                    }
                }
            }

            if(tempInstance.y < 0) {
                tempInstance.y = 0
            }
            tempInstanceMap.set(data.uuid,tempInstance)
        })

        setInstanceMap(new Map(tempInstanceMap))
    }


    useEffect(() => {  
        if(!inTimeSlice) {
            setInTimeSlice(true)
            setTimeout(() => {
                setInTimeSlice(false)
                update()
            }, (1/frameRate)*1000);
        }
    },[inTimeSlice,update,keysDown])

    return (
        <div className={clsx("absolute w-full h-full border z-0",
                                theme === "light" && "bg-white",
                                theme === "dark" && "bg-neutral-900")}>
                {activeSprites.map(data => {
                    const instance = instanceMap?.get(data.uuid)
                    if(!instance || !data.spriteType.states[instance.curState]) return;

                    return (
                        <div className={`border absolute w-40 h-40`} style={{bottom: instance.y, left: instance.x}}>
                            <SpriteDisplay flip={data.spriteType.direction !== instance.direction} imageFiles={data.spriteType.states[instance.curState]!.frames} fps={data.spriteType.states[instance.curState]!.fps} />
                        </div>
                )
                })}

        </div>
    )
}