import { createContext, useState } from 'react';
import './App.css'
import { Overlay } from './components/Overlay/Overlay'
import { Playground } from './components/Playground';
import { v4 } from 'uuid';

export const ThemeContext = createContext<{theme?: string, setTheme?: (theme: string) => void}>({});

export interface SpriteData {
  uuid: string
  direction: "LEFT" | "RIGHT"
  states: {
    "IDLE": {fps: number, frames: string[]},
    "RUN"?: {fps: number, frames: string[]},
    "JUMP"?: {fps: number, frames: string[]},
    "DASH"?: {fps: number, frames: string[]},
    "ATTACK"?: {fps: number, frames: string[]},
  }
}

function App() {
  const [theme, setTheme] = useState<string>("light")
  const [spriteData, setSpriteData] = useState<SpriteData[]>([])
  const [activeSprites, setActiveSprites] = useState<{spriteType: SpriteData, uuid: string}[]>([])

  const addSpriteType = (data: SpriteData) => {
    setSpriteData([...spriteData,data])
    addSpriteInstance(data)
  }

  const addSpriteInstance = (type: SpriteData) => {
    setActiveSprites([...activeSprites,{spriteType: type, uuid: v4()}])
  }

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        <Overlay addSprite={addSpriteType}/>
        <Playground activeSprites={activeSprites}/>
      </ThemeContext.Provider>
    </>
  )
}

export default App
