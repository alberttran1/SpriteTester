import { useEffect, useState } from 'react'

interface SpriteDisplayProps {
    imageFiles : string[];
    fps: number;
    flip?: boolean;
}

const SpriteDisplay = (props : SpriteDisplayProps) => {
    const {imageFiles,fps,flip} = props
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [inTimeSlice, setInTimeSlice] = useState<boolean>(false);

    useEffect(() => {  
        if(!inTimeSlice) {
            setInTimeSlice(true)
            setTimeout(() => {
                setInTimeSlice(false)
                if (currentIndex < 0 || currentIndex >= imageFiles.length) setCurrentIndex(0);
                else setCurrentIndex((currentIndex + 1) % imageFiles.length)
            }, (1/fps)*1000);
        }
    },[currentIndex,imageFiles,fps,inTimeSlice])

    // console.log(currentIndex,fps,imageFiles.length)


    const showIndex = currentIndex < 0 || currentIndex >= imageFiles.length || imageFiles.length < 1 ? 0 : currentIndex

  return (
        <img className={`w-full h-full object-contain ${flip && "scale-x-[-1]"}`} src={imageFiles[showIndex]}/>
  )
}

export default SpriteDisplay