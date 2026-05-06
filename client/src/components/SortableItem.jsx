import React from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

const SortableItem = ({ task, handleComplete, handleDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id: task._id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} handleComplete={handleComplete} handleDelete={handleDelete} />
      <div className="border-b border-gray-700"></div>
    </div>
  );
};

export default SortableItem