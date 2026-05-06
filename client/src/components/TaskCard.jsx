import React from 'react'
import { Check, X } from 'lucide-react'

const TaskCard = ({ task, handleComplete, handleDelete }) => {
  return (
    <label className="group flex justify-between items-center gap-4 px-4 py-6 hover:bg-slate-800 transition cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <input
            type="checkbox"
            checked={task?.completed}
            onChange={() => handleComplete(task?._id)}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${task?.completed ? "border-transparent bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500" : "border-gray-500"}`}>
            {task?.completed && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>
        <span className={`text-gray-300 text-lg ${task?.completed ? "line-through text-gray-500" : ""} transition`}>
          {task?.title}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(task?._id);
        }}
        className="opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-red-400 cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>
    </label>
  )
}

export default TaskCard
