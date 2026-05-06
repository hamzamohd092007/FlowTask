import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProfilePage = ({ user, tasks, setUser, handleLogout, handleDelete }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const data = [
    { name: "Active", value: active },
    { name: "Completed", value: completed },
  ];

  const COLOR_CLASSES = ["fill-blue-600", "fill-green-600"];

  const deleteAccount = () => {
    setIsDeletingAccount(true);
  }

  if (isDeletingAccount) {
    return (
      <div className="w-screen h-screen p-4 flex items-center justify-center bg-slate-950">
        <div className="flex flex-col gap-4 w-full max-w-md bg-slate-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-400">
            Warning
          </h2>
          <h4 className="text-md text-gray-200">
            Are you sure that you want to delete your account?
          </h4>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsDeletingAccount(false)} className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-md cursor-pointer transition">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white">
      <div className="absolute top-0 left-0 w-full h-[35%] bg-linear-to-r from-indigo-800 via-violet-800 to-purple-800"></div>
      <div className="relative z-10 flex justify-center px-4 py-16">
        <div className="w-full max-w-xl space-y-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-800 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl sm:text-2xl font-semibold">Profile</h2>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-4 sm:p-6 flex items-center justify-between shadow-xl shadow-black/50 border border-slate-800">
            <div className="flex items-center gap-2 sm:gap-5">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-violet-500">
                <img src={user?.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">{user?.fullName}</h2>
                <p className="text-slate-400 text-xs sm:text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={handleLogout} className="px-2 py-1 sm:px-4 sm:py-3 rounded-md bg-red-600 hover:bg-red-700 cursor-pointer transition active:scale-95">
                Logout
              </button>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 shadow-xl shadow-black/50 border border-slate-800 space-y-6">
            <h3 className="text-lg font-semibold tracking-wide">
              Analytics
            </h3>
            {total === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-slate-400 text-sm">
                  No task created yet </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-center">
                  <div>
                    <p className="text-3xl font-bold">{total}</p>
                    <p className="text-slate-400 text-sm">Total</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-indigo-400">{active}</p>
                    <p className="text-slate-400 text-sm">Active</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">{completed}</p>
                    <p className="text-slate-400 text-sm">Completed</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-slate-950 p-4 rounded-xl">
                    <PieChart width={250} height={250}>
                      <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" >
                        {data.map((entry, index) => (
                          <Cell key={index} className={COLOR_CLASSES[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 shadow-xl shadow-black/50 border border-slate-800">
            <button onClick={deleteAccount} className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 cursor-pointer transition active:scale-95">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;