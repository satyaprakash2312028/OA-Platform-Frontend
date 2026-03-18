import React, { useEffect } from 'react'
import { AnimatePresence, easeInOut, motion, spring } from 'motion/react'
import { CodeIcon, SettingsIcon, LogIn, Rocket, User2, PlusIcon, LayoutDashboardIcon, LucideMenu, LogOut, ListIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import useNavStore from '../store/useNavStore.js'
import useThemeStore from '../store/useThemeStore.js'
const MotionLink = motion.create(Link);
const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const { navVisible } = useNavStore();
  const handleLogout = async (e) => {
    e.preventDefault();
    if (authUser) await logout();
  }
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "cupcake" : "dark");
    console.log(theme);
  }
  useEffect(() => {
    console.log(navVisible);
  }, [navVisible]);
  return (
    <motion.header
      initial={{ translateY: -100, opacity: 0 }}
      animate={{ translateY: (navVisible ? 0 : -100), opacity: Number(navVisible) }}
      transition={{ duration: 0.8, type: 'spring' }}
      className={`fixed z-50 border-base-300 shadow-lg border-b top-0 left-0 w-full justify-between h-16 bg-base-200/30 flex items-center px-4 backdrop-blur-md`}
    >
      <Link to="/">
        <div className="flex items-center space-x-3">
          <CodeIcon size={23} className="text-primary decoration-primary " />
          <span className={`text-lg font-mono opacity-0 max-w-0 ${authUser ? "md:max-w-2xl md:opacity-100" : "sm:max-w-2xl sm:opacity-100"} sm:ml-1.5 ml-0 whitespace-nowrap overflow-hidden transition-all duration-300`}>Codephilia</span>
        </div>
      </Link>

      {authUser && (<div className='flex justify-center gap-5 w-fit md:gap-7 transition-all duration-300'>
        <MotionLink
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          to="/dashboard"
          className="btn border-none bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-primary bg-none hover:bg-none">
          <LayoutDashboardIcon className="md:size-0 transition-all duration-300 size-5" />
          <span className='opacity-0 max-w-0 md:max-w-2xl md:ml-1.5 ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Dashboard</span>
        </MotionLink>
        <MotionLink
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          to="/problemset"
          className="btn border-none bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-primary bg-none hover:bg-none">
          <ListIcon className="md:size-0 transition-all duration-300 size-5" />
          <span className='opacity-0 max-w-0 md:max-w-2xl md:ml-1.5 ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Problemset</span>
        </MotionLink>
        <MotionLink
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          to="/contests"
          className="btn border-none bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-primary bg-none hover:bg-none">
          <Rocket className="md:size-0 transition-all duration-300 size-5" />
          {/* <UseAnimations animation={archive} size={56} /> */}
          <span className='opacity-0 max-w-0 md:max-w-2xl md:ml-1.5 ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Contests</span>
        </MotionLink>
      </div>)}

      <div
        className='flex items-center rounded-full justify-end'>
        <label className="swap swap-rotate scale-[60%] bg-base-300 p-3 px-5 rounded-full"
        >
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" 
          onChange={toggleTheme}
          />

          {/* sun icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      
      <div className='flex justify-center gap-3.5 max-w-0 sm:max-w-7xl fixed sm:relative right-0 overflow-hidden transition-all duration-300 sm:opacity-100 opacity-0'>
        {/* Dynamic auth buttons */}
        {authUser && (<motion.button
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={handleLogout}
          className="bg-base-300 btn border-none btn-soft shadow-none w-fit space-x-0 gap-0  transition-colors duration-300 hover:bg-error">
          <LogOut size={18} className="" />
          <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Logout</span>
        </motion.button>)}
        {!authUser && (<><MotionLink
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          to="/login"
          className="bg-base-300 btn border-none btn-soft shadow-none w-fit space-x-0 gap-0  transition-colors duration-300 hover:bg-success">
          <User2 size={18} className="" />
          <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Login</span>
        </MotionLink>
          <MotionLink
            transition={{ duration: 0.2 }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            to="/register"
            className="bg-base-300 btn border-none btn-soft shadow-none w-fit space-x-0 gap-0  transition-colors duration-300 hover:bg-success">
            <PlusIcon size={18} className="" />
            <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Register</span>
          </MotionLink></>)}
      </div>

      {/* Mobile / small dropdown */}
      <div className='flex z-40 justify-center gap-3.5 sm:fixed relative right-0 sm:scale-0 scale-100 transition-all duration-300'>
        <div className="dropdown dropdown-end ">
          <div tabIndex={0} role="button" className="bg-base-300 btn btn-soft hover:border-none hover:shadow-none focus:shadow-none hover:text-primary m-1 app-btn border-none shadow:none outline-none transition-all duration-300 ">
            <LucideMenu key="open" size={18} />
          </div>
          <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            {authUser ? (
              <>
                {/* <li><MotionLink to="/profile" className=""><span className='font-semibold'>Profile</span></MotionLink></li> */}
                <li><button onClick={handleLogout} className="font-semibold w-full text-left">Logout</button></li>
              </>
            ) : (
              <>
                <li><MotionLink to="/login" className=""><span className='font-semibold'>Login</span></MotionLink></li>
                <li><MotionLink to="/register" className=""><span className='font-semibold'>Register</span></MotionLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
      </div>

    </motion.header>
  )
}

export default Navbar