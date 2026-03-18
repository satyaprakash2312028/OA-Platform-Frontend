import React, { useState, useRef, useEffect } from 'react';
import Editor from './Editor.jsx';
import { ChevronDown } from 'lucide-react'; // Optional: Use an icon library or just text 'v'
import useEditorStore from '../store/useEditorStore.js';
const WrapEditor = () => {
    const { language, setLanguage } = useEditorStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const languages = [
        { id: 'cpp', label: 'C++' },
        { id: 'java', label: 'Java' },
        { id: 'python', label: 'Python' }
    ];

    const handleSelect = (id) => {
        setLanguage(id);
        setIsOpen(false);
    };

    return (
        <div className='flex h-dvh flex-col overflow-y-auto overflow-x-hidden bg-base-200 z-20'>
            <div className='relative z-10  w-full min-w-96 font-mono' ref={dropdownRef}>
                {/* 1. The Trigger Button (Replaces <select>) */}
                <span 
                    className="
                        flex items-center justify-between px-4 py-2 w-28
                        rounded-lg transition-all duration-300
                        text-sm font-semibold mb-1
                    "
                >
                    {/* Display the Label for the current ID */}
                    <span>{languages.find(l => l.id === language)?.label}</span>
                    
                    {/* Arrow Icon with rotation animation */}
                    <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`transform transition-all flex justify-center items-center rounded-md duration-300 bg-base-200 hover:bg-base-300 size-6`}>
                        <ChevronDown size={16} className={`${isOpen ? 'rotate-180' : 'rotate-0'} transition-[rotate] duration-300`}/>
                    </button>
                </span>

                {/* 2. The Dropdown List (Replaces <option>s) */}
                <div 
                    className={`
                        absolute top-full left-0 mt-2 w-32 
                        bg-base-200 rounded-lg shadow-xl z-50 overflow-hidden
                        transition-all duration-200 ease-in-out origin-top
                        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                    `}
                >
                    <ul className="flex flex-col">
                        {languages.map((item) => (
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

            <Editor/>
        </div>
    );
}

export default WrapEditor;