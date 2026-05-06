import React, { useState } from 'react'
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { getPasswordStrength, normalizeEmail, normalizeName, validateAuth, formatName } from "../utils/validators";
import { Eye, EyeOff, Upload } from 'lucide-react';

const AuthPage = ({ setUser }) => {

  const [currentState, setCurrentState] = useState("Sign In");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const { isSubmitValid } = validateAuth({ type: currentState === "Sign Up" ? "signup" : "signin", fullName, email, password, confirmPassword });

  const handleSignUp = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signup", fullName, email, password, confirmPassword });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    const formData = new FormData();
    formData.append("fullName", formatted.fullName);
    formData.append("email", formatted.email);
    formData.append("password", password);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const { data } = await API.post("/user/signup", formData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setAvatar(null);
    setAvatarFile(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  const handleSignIn = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signin", email, password });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    try {
      const { data } = await API.post("/user/signin", { email: formatted.email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setEmail("");
    setPassword("");
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950">
      <div className="absolute top-0 left-0 w-full h-[40%] bg-linear-to-r from-indigo-800 via-violet-800 to-purple-800"></div>
      <div className="relative z-10 flex flex-col items-center pt-24 px-4">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center">
            <h1 className="text-5xl text-white font-bold tracking-widest">
              FlowTask
            </h1>
            <p className="text-slate-400 mt-2">
              {currentState === "Sign In" ? "Sign in to your account" : "Create your account"}
            </p>
          </div>
          <div className="flex flex-col gap-5 p-6 rounded-md bg-slate-900 shadow-xl shadow-black/50">
            {currentState === "Sign Up" && (
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Full Name*
                </label>
                <input
                  type="text"
                  placeholder="Mohd Hamza"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={(e) => setFullName(formatName(e.target.value))}
                  className="w-full bg-transparent border-b border-slate-600 py-2 text-white outline-none focus:border-violet-500"
                />
              </div>
            )}
            {currentState === "Sign Up" && (
              <div className="flex items-center gap-4">
                <label className="cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatar ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-600">
                      <img src={avatar} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="group flex items-center justify-center w-16 h-16 rounded-full text-xs bg-black text-gray-200 border border-slate-600">
                      <div className="hidden group-hover:flex flex-col gap-1 items-center justify-center">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    </div>
                  )}
                </label>
                <span className="text-sm text-slate-400">Upload avatar</span>
              </div>
            )}
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Email*
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-slate-600 py-2 text-white outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={currentState === "Sign Up" ? "Create your password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-600 py-2 text-white outline-none focus:border-violet-500"
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                  {!showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </span>
              </div>
              {currentState === "Sign Up" && password && (
                <p className={`text-xs mt-1 ${strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                  Strength: {strength}
                </p>
              )}
            </div>
            {currentState === "Sign Up" && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-600 py-2 text-white outline-none focus:border-violet-500"
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                  {!showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </span>
              </div>
            )}
            <button disabled={!isSubmitValid} onClick={currentState === "Sign Up" ? handleSignUp : handleSignIn} className={`mt-4 py-2 rounded-md text-white font-semibold bg-linear-to-r transition ${isSubmitValid ? "from-indigo-500 via-violet-500 to-purple-500 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600" : "opacity-50 cursor-not-allowed from-indigo-600 via-violet-600 to-purple-600"} cursor-pointer transition`}>
              {currentState === "Sign Up" ? "Create now" : "Login now"}
            </button>
          </div>
          <p className="text-center text-sm text-slate-500">
            {currentState === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span onClick={() => setCurrentState(currentState === "Sign Up" ? "Sign In" : "Sign Up")} className="text-violet-400 cursor-pointer hover:underline">
              {currentState === "Sign Up" ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage