import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom';
import SortableItem from '../components/SortableItem';
import TaskCard from '../components/TaskCard';

const HomePage = ({ user, tasks, setTasks }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [newTask, setNewTask] = useState("");
  const incompletedTasks = tasks.filter(task => !task.completed).length;

  const filteredTasks = tasks?.filter(task => {
    if (filter === "Active") return !task?.completed;
    if (filter === "Completed") return task?.completed;
    return true;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleAdd = async () => {
    try {
      const { data } = await API.post("/task/add", { title: newTask });
      setTasks(prev => [data.task, ...prev])
      toast.success("Task added");
      setNewTask("")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleDragEnd = async (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t._id === active.id);
    const newIndex = tasks.findIndex(t => t._id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);
    try {
      await API.put("/task/reorder", {
        tasks: newTasks.map((task, index) => ({
          _id: task._id,
          order: index,
        })),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const { data } = await API.put(`/task/complete/${taskId}`);
      setTasks(prev => prev.map(task => task._id === taskId ? data.task : task));
      if (data.task.completed) {
        toast.success("Task completed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleDelete = async (taskId) => {
    try {
      const { data } = await API.delete(`/task/delete/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleClearCompleted = async () => {
    try {
      const { data } = await API.delete("/task/clear-completed-task");
      setTasks(prev => prev.filter(task => !task.completed));
      if (data.deletedCount === 1) {
        toast.success("Cleared a task");
      } else {
        toast.success(`Cleared ${data.deletedCount} tasks`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950">
      <div className="absolute top-0 left-0 w-full h-[40%] bg-linear-to-r from-indigo-800 via-violet-800 to-purple-800"></div>
      <div className="relative z-10 flex flex-col items-center pt-24 px-4">
        <div className="space-y-12 w-full max-w-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl text-white font-bold tracking-widest">
              FlowTask
            </h2>
            <Link to="/profile" className="w-12 h-12 flex items-center justify-center rounded-full border border-white cursor-pointer overflow-hidden">
              <img src={user?.avatar} alt="" className="w-full h-full object-cover" />
            </Link>
          </div>
          <div className="space-y-6">
            <div className="flex gap-3 px-4 py-6 items-center rounded-md bg-slate-900 shadow-md">
              <input
                type="text"
                placeholder="Create a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none"
              />
              <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 text-white text-sm hover:bg-slate-700 transition cursor-pointer active:scale-95">
                Add
              </button>
            </div>
            <div className="flex flex-col rounded-md bg-slate-900 shadow-xl shadow-black/50">
              <div className="max-h-80 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    No tasks found
                  </div>
                ) : (
                  filter !== "All" ? (
                    filteredTasks.map(task => (
                      <div key={task?._id}>
                        <TaskCard task={task} handleComplete={handleComplete} handleDelete={handleDelete} />
                        <div className="border-b border-gray-700"></div>
                      </div>
                    ))
                  ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy} >
                        <div className="max-h-80 overflow-y-auto">
                          {filteredTasks.length === 0 ? (
                            <div className="text-center text-gray-500 py-6">
                              No tasks found
                            </div>
                          ) : (
                            filteredTasks.map(task => (
                              <SortableItem key={task._id} task={task} handleComplete={handleComplete} handleDelete={handleDelete} />
                            ))
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )
                )}
              </div>
              <div className="w-full flex items-center justify-between gap-3 p-4 text-xs text-gray-500">
                <span className="w-1/4">
                  {incompletedTasks === 0 ? "No task left" : (incompletedTasks === 1 ? "1 task left" : `${incompletedTasks} tasks left`)}
                </span>
                <div className="flex w-1/2 gap-4 justify-center">
                  {["All", "Active", "Completed"].map((tab) => (
                    <button key={tab} onClick={() => setFilter(tab)} className={`${tab === filter ? "text-blue-500 hover:text-blue-600" : "hover:text-blue-400"} transition cursor-pointer`}>
                      {tab}
                    </button>
                  ))}
                </div>
                <span onClick={() => handleClearCompleted()} className="w-1/4 text-right hover:text-red-400 transition cursor-pointer">
                  Clear Completed
                </span>
              </div>
            </div>
          </div>
          <div className="w-full text-center text-sm text-gray-600">
            Drag and drop to reorder list
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
