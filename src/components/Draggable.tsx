import {Data} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { ReactNode } from 'react';
import { CSS } from "@dnd-kit/utilities";


interface DraggableProps {
    id: string;
    children: ReactNode;
    data: Data;
    className?: string;
}

export const Draggable = (props : DraggableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id, data: props.data});
  
  return (
    <li className={`${props.className} list-none`} style={{transform: CSS.Transform.toString(transform) , transition: transition}} ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </li>
  );
}