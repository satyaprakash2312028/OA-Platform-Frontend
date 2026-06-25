import React, { useState } from 'react';
import { Mail, Lock, LockKeyholeOpen, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore.js';

const MotionMail = motion.create(Mail);
const MotionLock = motion.create(Lock);
const MotionLockKeyholeOpen = motion.create(LockKeyholeOpen);

// 1. Hoist Repeating Animations
const FADE_UP_ANIM = {
  initial: { opacity: 0.2, scale: 0.8, y: -35 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, type: "spring" } }
};

const SignupPage = React.memo(() => {
  // 2. Granular Zustand Selectors
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const signup = useAuthStore((state) => state.signup);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match.");
      return;
    }
    const fullName = `${firstName} ${lastName}`;
    await signup({ fullName, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mt-48 sm:mx-8 mx-2 h-fit">
      <motion.fieldset
        className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-16"
        {...FADE_UP_ANIM}
      >
        <motion.legend className="fieldset-legend text-sm" {...FADE_UP_ANIM}>
          Signup
        </motion.legend>
        
        <div className="flex justify-center gap-4">
          <motion.label
            className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
            {...FADE_UP_ANIM}
            whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
          >
            <input 
              type="text" 
              placeholder="First Name" 
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0 w-full'
            />
          </motion.label>
          
          <motion.label
            className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
            {...FADE_UP_ANIM}
            whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
          >
            <input 
              type="text" 
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0 w-full'
            />
          </motion.label>
        </div>

        <motion.label
          className="mb-6 w-full input validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionMail size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input 
            type="email" 
            placeholder="mail@site.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-52 sm:w-60 transition-all duration-200 focus:outline-none border-0 focus:border-0 outline-0'
          />
        </motion.label>

        <motion.label
          className="mb-6 w-full input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionLock size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input
            type="password"
            required
            placeholder="•••••••••••••••••"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            className={`w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0 ${password !== "" ? "blur-xs" : ""}`}
          />
        </motion.label>

        <motion.label
          className="mb-6 w-full input transition-validator focus:outline-none border-0 focus:border-0 outline-0 shadow-sm"
          {...FADE_UP_ANIM}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          <MotionLockKeyholeOpen size={18} className='opacity-55 mr-1' initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.5, scale: 1 }} />
          <input
            type="password"
            required
            placeholder="•••••••••••••••••"
            minLength="8"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            className={`w-52 sm:w-60 transition-all duration-75 focus:outline-none border-0 focus:border-0 outline-0 ${confirmPassword !== "" ? "blur-xs" : ""}`}
          />
        </motion.label>

        <motion.button
          disabled={isSigningUp}
          type='submit'
          className="btn btn-primary mt-4 w-full shadow-none"
          {...FADE_UP_ANIM}
          whileHover={{ scale: 1.05, transition: { duration: 0.2, type: "tween" } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.2, type: "tween" } }}
        >
          {!isSigningUp ? 'Signup' : <><Loader2 size={18} className="animate-spin" />Loading...</>}
        </motion.button>
      </motion.fieldset>
    </form>
  );
});

SignupPage.displayName = 'SignupPage';
export default SignupPage;