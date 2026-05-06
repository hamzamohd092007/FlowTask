import React, { useEffect, useState } from 'react'
import TaskCard from './components/TaskCard';
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import Loading from './components/Loading';
import API from './utils/axios'
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const { data } = await API.get("/user/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    verifyUser();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await API.get("/task/get");
      setTasks(data.tasks)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user?._id]);

  const handleLogout = () => {
    setUser(null);
    setTasks(null);
    localStorage.removeItem("token");
  }

  const handleDelete = async () => {
    const {data} = await API.delete("/user/delete");
    setUser(null);
    setTasks(null);
    localStorage.removeItem("token");
  }

  if (loading || (user && !tasks)) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#020618', color: '#fff', }, }} />
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <HomePage user={user} tasks={tasks} setTasks={setTasks} /> : <Navigate to='/auth' />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} tasks={tasks} setUser={setUser} handleLogout={handleLogout} handleDelete={handleDelete} /> : <Navigate to='/auth' />} />
      </Routes>
    </>
  )
}

export default App
