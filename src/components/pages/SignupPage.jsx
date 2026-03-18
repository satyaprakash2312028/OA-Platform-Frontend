import React, { useEffect, useState } from 'react'
import { Eye, Mail, Lock, EyeOff, LockKeyholeOpen, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore.js'
const MotionMail = motion.create(Mail);
const MotionLock = motion.create(Lock);
const MotionLockKeyholeOpen = motion.create(LockKeyholeOpen);
const MotionEye = motion.create(Eye);
const MotionEyeOff = motion.create(EyeOff);
const SignupPage = () => {
  const { login, authUser, isSigningUp, signup } = useAuthStore();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = firstName + ' ' + lastName;
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match.");
      return;
    }
    console.log("Signing up");
    await signup({ fullName, email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-48 sm:mx-8 mx-2 h-fit">
      <motion.fieldset
        className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-16"
        initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
        animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
      >
        <motion.legend
          className="fieldset-legend text-sm"
          initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
          animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
        >Signup</motion.legend>
        <div
          className="flex justify-center gap-4"
        >
          <motion.label
            className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
            initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
            animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
          >

            {/* <MotionMail size={18}
              className='opacity-55 mr-1'
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.5, scale: 1 }}
            /> */}
            <input type="text" placeholder="First Name" required
              value={firstName}
              onChange={(e) => { e.preventDefault(); setFirstName(e.target.value) }}
              className='transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
            />

          </motion.label>
          <motion.label
            className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
            initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
            animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
          >

            {/* <MotionMail size={18}
              className='opacity-55 mr-1'
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.5, scale: 1 }}
            /> */}
            <input type="text" placeholder="Last Name"
              value={lastName}
              onChange={(e) => { e.preventDefault(); setLastName(e.target.value) }}
              className='transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
            />

          </motion.label>
        </div>
        <motion.label
          className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
          animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >

          <MotionMail size={18}
            className='opacity-55 mr-1'
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1 }}
          />
          <input type="email" placeholder="mail@site.com" required
            value={email}
            onChange={(e) => { e.preventDefault(); setEmail(e.target.value) }}
            className='w-52 sm:w-60 transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
          />
        </motion.label>

        <motion.label
          className="mb-6 w-full input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
          animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionLock size={18}
            className='opacity-55 mr-1'
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1 }}
          />
          <input
            type={"password"}
            required
            placeholder={"•••••••••••••••••"}
            minLength="8"
            value={password}
            onChange={(e) => { e.preventDefault(); setPassword(e.target.value) }}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            className={`w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0 ${password !== "" ? "blur-xs" : ""}`}
          />
          {/* <motion.button
            type='button'
            className='flex items-center justify-center h-fit'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, transition: { duration: 0.2, type: "tween" } }}
            onClick={(e) => { e.preventDefault(); setIsPasswordVisible(!isPasswordVisible) }}
          >
            <AnimatePresence mode="wait" initial={true}>
              {isPasswordVisible ? (
                <MotionEye
                  key="visible" // Unique key is REQUIRED for AnimatePresence
                  size={18}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                />
              ) : (
                <MotionEyeOff
                  key="hidden" // Unique key is REQUIRED for AnimatePresence
                  size={18}
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>
          </motion.button> */}
        </motion.label>
        <motion.label
          className="mb-6 w-full input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
          animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionLockKeyholeOpen size={18}
            className='opacity-55 mr-1'
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1 }}
          />
          <input
            type={"password"}
            required
            placeholder={"•••••••••••••••••"}
            minLength="8"
            value={confirmPassword}
            onChange={(e) => { e.preventDefault(); setConfirmPassword(e.target.value) }}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            className={`w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0 ${confirmPassword !== "" ? "blur-xs" : ""}`}
          />
          {/* <motion.button
            type='button'
            className='flex items-center justify-center h-fit'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, transition: { duration: 0.2, type: "tween" } }}
            onClick={(e) => { e.preventDefault(); setIsPasswordVisible(!isPasswordVisible) }}
          >
            <AnimatePresence mode="wait" initial={true}>
              {isPasswordVisible ? (
                <MotionEye
                  key="visible" // Unique key is REQUIRED for AnimatePresence
                  size={18}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                />
              ) : (
                <MotionEyeOff
                  key="hidden" // Unique key is REQUIRED for AnimatePresence
                  size={18}
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>
          </motion.button> */}
        </motion.label>

        <motion.button
          disabled={isSigningUp}
          type='submit'
          className="btn btn-primary mt-4 w-full shadow-none "
          initial={{ opacity: 0.2, scale: 0.8, translateY: -35 }}
          animate={{ opacity: 1, scale: 1, translateY: 0, transition: { duration: 0.5, type: "spring" } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2, type: "tween" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          {!isSigningUp ? (<>Signup</>) : (<><Loader2 size={18} className="animate-spin" />Loading...</>)}
        </motion.button>
      </motion.fieldset>
    </form>
  )
}

export default SignupPage