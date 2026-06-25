import React, { useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
    CodeIcon, 
    LayoutDashboardIcon, 
    Rocket, 
    LogOut, 
    User2, 
    PlusIcon, 
    LucideMenu, 
    ListIcon 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useNavStore from '../store/useNavStore';
import useThemeStore from '../store/useThemeStore';
import DAISY_UI_CONSTANTS from '../constants/daisy_ui_contants';

const MotionLink = motion.create(Link);

// 1. Hoist Static Animation Objects
// Prevents framer-motion from allocating new memory for these objects on every render
const LINK_ANIMATION = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
};

const HEADER_TRANSITION = { duration: 0.8, type: 'spring' };

const Navbar = React.memo(() => {
    // 2. Granular Zustand Subscriptions
    // Subscribing only to the exact primitives needed prevents layout thrashing
    // if other uncorrelated states inside these stores update.
    const authUser = useAuthStore((state) => state.authUser);
    const logout = useAuthStore((state) => state.logout);
    
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);
    
    const navVisible = useNavStore((state) => state.navVisible);

    // Removed unused useNavigate hook
    const location = useLocation();

    // 3. Memoized Event Handlers
    const handleLogout = useCallback(async (e) => {
        e.preventDefault();
        if (authUser) await logout();
    }, [authUser, logout]);

    const toggleTheme = useCallback(() => {
        setTheme(theme === DAISY_UI_CONSTANTS.DARK_THEME ? DAISY_UI_CONSTANTS.LIGHT_THEME : DAISY_UI_CONSTANTS.DARK_THEME);
    }, [theme, setTheme]);

    // 4. Batch Route Matching
    // Instead of computing string matching multiple times inline, compute it once per path change.
    const activeRoute = useMemo(() => ({
        dashboard: location.pathname.startsWith('/dashboard'),
        problemset: location.pathname.startsWith('/problemset'),
        contests: location.pathname.startsWith('/contests')
    }), [location.pathname]);

    return (
        <motion.header
            initial={{ translateY: -100, opacity: 0 }}
            animate={{ translateY: navVisible ? 0 : -100, opacity: Number(navVisible) }}
            transition={HEADER_TRANSITION}
            className={`fixed z-50 border-b-base-300 shadow-lg border-b top-0 left-0 w-full justify-between h-16 bg-base-200/60 flex items-center px-4 backdrop-blur-sm`}
        >
            <Link to="/">
                <div className="flex items-center space-x-3">
                    <CodeIcon size={23} className="text-primary decoration-primary" />
                    <span className={`text-lg font-mono opacity-0 max-w-0 ${authUser ? "md:max-w-2xl md:opacity-100" : "sm:max-w-2xl sm:opacity-100"} sm:ml-1.5 ml-0 whitespace-nowrap overflow-hidden transition-all duration-300`}>
                        Codephilia
                    </span>
                </div>
            </Link>

            {authUser && (
                <div className='absolute left-1/2 -translate-x-1/2 flex justify-center gap-5 w-fit sm:gap-10 transition-all duration-300'>
                    <MotionLink
                        {...LINK_ANIMATION}
                        to="/dashboard"
                        className={`${activeRoute.dashboard ? 'border-b-primary text-primary' : 'border-transparent'} border-transparent rounded-none btn hover:border-b-primary border-3 h-16 bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-primary bg-none hover:bg-none`}
                    >
                        <LayoutDashboardIcon className="md:size-0 transition-all duration-300 size-5" />
                        <span className='tracking-wide opacity-0 max-w-0 md:max-w-2xl ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Dashboard</span>
                    </MotionLink>
                    
                    <MotionLink
                        {...LINK_ANIMATION}
                        to="/problemset"
                        className={`${activeRoute.problemset ? 'border-b-secondary text-secondary' : 'border-transparent'} border-transparent rounded-none btn hover:border-b-secondary border-3 h-16 bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-secondary bg-none hover:bg-none`}
                    >
                        <ListIcon className="md:size-0 transition-all duration-300 size-5" />
                        <span className='tracking-wide opacity-0 max-w-0 md:max-w-2xl ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Problemset</span>
                    </MotionLink>
                    
                    <MotionLink
                        {...LINK_ANIMATION}
                        to="/contests"
                        className={`${activeRoute.contests ? 'border-b-accent text-accent' : 'border-transparent'} border-transparent rounded-none btn hover:border-b-accent border-3 h-16 bg-transparent shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 app-btn hover:text-accent bg-none hover:bg-none`}
                    >
                        <Rocket className="md:size-0 transition-all duration-300 size-5" />
                        <span className='tracking-wide opacity-0 max-w-0 md:max-w-2xl ml-0 md:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Contests</span>
                    </MotionLink>
                </div>
            )}

            <div className='flex items-center rounded-full justify-end'>
                <label className="sm:mr-6 invisible sm:visible swap swap-rotate text-base-content/70 hover:text-primary transition-colors">
                    <input type="checkbox" onChange={toggleTheme} checked={theme !== DAISY_UI_CONSTANTS.DARK_THEME} />
                    {/* Sun */}
                    <svg className="swap-on size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    {/* Moon */}
                    <svg className="swap-off size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>

                <div className='flex justify-center gap-3.5 max-w-0 sm:max-w-7xl fixed sm:relative right-0 overflow-hidden transition-all duration-300 sm:opacity-100 opacity-0'>
                    {authUser ? (
                        <motion.button
                            {...LINK_ANIMATION}
                            onClick={handleLogout}
                            className="bg-base-200 btn shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 hover:bg-error hover:text-warning-content"
                        >
                            <LogOut size={18} />
                            <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Logout</span>
                        </motion.button>
                    ) : (
                        <>
                            <MotionLink
                                {...LINK_ANIMATION}
                                to="/login"
                                className="bg-base-300 btn border-none btn-soft shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 hover:bg-success hover:text-success-content"
                            >
                                <User2 size={18} />
                                <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Login</span>
                            </MotionLink>
                            <MotionLink
                                {...LINK_ANIMATION}
                                to="/register"
                                className="bg-base-300 btn border-none btn-soft shadow-none w-fit space-x-0 gap-0 transition-colors duration-300 hover:bg-primary hover:text-primary-content"
                            >
                                <PlusIcon size={18} />
                                <span className='opacity-0 max-w-0 lg:max-w-2xl lg:ml-1.5 ml-0 lg:opacity-100 whitespace-nowrap overflow-hidden transition-all duration-300'>Register</span>
                            </MotionLink>
                        </>
                    )}
                </div>

                {/* Mobile / small dropdown */}
                <div className='flex z-40 justify-center gap-3.5 sm:fixed relative right-0 sm:scale-0 scale-100 transition-all duration-300'>
                    <div className="dropdown dropdown-end ">
                        <div tabIndex={0} role="button" className="bg-base-300 btn btn-soft hover:border-none hover:shadow-none focus:shadow-none hover:text-primary m-1 app-btn border-none shadow:none outline-none transition-all duration-300">
                            <LucideMenu key="open" size={18} />
                        </div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            {authUser ? (
                                <li><button onClick={handleLogout} className="font-semibold w-full text-left">Logout</button></li>
                            ) : (
                                <>
                                    <li><MotionLink to="/login"><span className='font-semibold'>Login</span></MotionLink></li>
                                    <li><MotionLink to="/register"><span className='font-semibold'>Register</span></MotionLink></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.header>
    );
});

Navbar.displayName = 'Navbar';

export default Navbar;