import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from './Editor.jsx';
import { ChevronDown } from 'lucide-react'; 
import useEditorStore from '../store/useEditorStore.js';

// 1. Hoist Constants
// Prevents recreating the array in memory on every keystroke/render
const LANGUAGES = [
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' }
];

// 2. Pre-compute Map for O(1) Lookups
// Replaces the O(N) array .find() method used in the render function
const LANGUAGE_LABEL_MAP = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python'
};

const WrapEditor = React.memo(() => {
    // 3. Granular Zustand Subscriptions (CRITICAL FIX)
    // Subscribing only to `language` protects this wrapper from re-rendering 
    // every time the user types and updates the `code` state in the store.
    const language = useEditorStore((state) => state.language);
    const setLanguage = useEditorStore((state) => state.setLanguage);
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 4. Stable Callbacks
    // Keeps function references stable so child elements don't see prop changes
    const toggleDropdown = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleSelect = useCallback((id) => {
        setLanguage(id);
        setIsOpen(false);
    }, [setLanguage]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = LANGUAGE_LABEL_MAP[language] || 'C++';

    return (
        <div className='flex h-dvh flex-col overflow-y-auto overflow-x-hidden bg-base-200 z-20'>
            <div className='relative z-10 w-full min-w-96 font-mono' ref={dropdownRef}>
                <span 
                    className="
                        flex items-center justify-between px-4 py-2 w-28
                        rounded-lg transition-all duration-300
                        text-sm font-semibold mb-1
                    "
                >
                    <span>{currentLabel}</span>
                    
                    <button 
                        onClick={toggleDropdown}
                        className={`transform transition-all flex justify-center items-center rounded-md duration-300 bg-base-200 hover:bg-base-300 size-6`}
                    >
                        <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : 'rotate-0'} transition-[rotate] duration-300`}/>
                    </button>
                </span>

                <div 
                    className={`
                        absolute top-full left-0 mt-2 w-32 
                        bg-base-200 rounded-lg shadow-xl z-50 overflow-hidden
                        transition-all duration-200 ease-in-out origin-top
                        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                    `}
                >
                    <ul className="flex flex-col">
                        {LANGUAGES.map((item) => (
                            <li 
                                key={item.id}
                                onClick={() => handleSelect(item.id)}
                                className={`
                                    px-4 py-2 cursor-pointer transition-colors duration-200
                                    hover:bg-primary/30 hover:text-white
                                    ${language === item.id ? 'bg-base-300' : ''}
                                `}
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Editor />
        </div>
    );
});

WrapEditor.displayName = 'WrapEditor';

export default WrapEditor;