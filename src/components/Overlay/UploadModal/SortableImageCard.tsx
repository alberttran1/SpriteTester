import { IconX } from "@tabler/icons-react";
import { Draggable } from "../../Draggable";

interface SortableImageCardProps {
  id: string
  index: number
  containerId: string
  delete: () => void;
  fileData: {data: File, url: string}
}


export const SortableImageCard = (props : SortableImageCardProps) => {

  return (
    <Draggable className="relative" id={props.id} data={{index: props.index}}>
        <div className="z-10 group absolute right-0" onClick={props.delete}>
          <IconX className="text-neutral-200 group-hover:text-neutral-400"/>
        </div>
        <div className={`border rounded shadow p-1 max-w-20 w-20 h-full transition-colors hover:bg-neutral-100`}>
            <img className='w-full h-[calc(100%-25px)] opacity-[75%] object-contain' src={props.fileData.url}/>
            <div className="text-neutral-700 text-sm text-center overflow-hidden text-ellipsis flex-1">
                {props.fileData.data.name}
            </div>
        </div>
    </Draggable>
  );
}
