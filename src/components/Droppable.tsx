import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import React, { ReactNode } from 'react'

interface DroppableProps {
    uuid: string;
    children?: ReactNode;
}

const Droppable = (props: DroppableProps) => {
    const {uuid, children} = props;
    const { setNodeRef, isOver } = useDroppable({
        id : uuid
    });
    
  return (
    <div className={
            clsx("bg-white border w-full h-full rounded shadow p-1transition-colors bg-neutral-200 flex items-center justify-center",
            isOver && " border-dotted border-2 border-indigo-600"
            )} 
            ref={setNodeRef}>{children}</div>
  )
}

export default Droppable