import React, { useState, useCallback, useRef, useMemo } from 'react'; // Added useMemo
import CodeMirror from '@uiw/react-codemirror';
import { cpp, cppLanguage } from '@codemirror/lang-cpp';
import { java, javaLanguage } from '@codemirror/lang-java';
import { python, pythonLanguage } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { autocompletion, completeAnyWord } from '@codemirror/autocomplete';
import { daisyUiBridge } from '../lib/daisyUiBridge.js';
import useEditorStore from '../store/useEditorStore.js';
import useThemeStore from '../store/useThemeStore.js';
// 1. Destructure the prop here for cleaner code
const Editor = () => { 
    const { code, setCode, language } = useEditorStore();
    const { theme } = useThemeStore();
    const timerRef = useRef(null);

    // 2. Use useMemo instead of useCallback for values/objects
    // AND include [language] in the dependency array!
    const langExtension = useMemo(() => {
        switch (language) {
            case 'cpp': return cpp();
            case 'java': return java();
            case 'python': return python();
            default: return cpp();
        }
    }, [language]); // <--- CRITICAL: Re-run when 'language' changes

    const themeExtension = useMemo(() => {
        return theme === 'sunset' ? dracula : []; 
    }, [theme]);

    const autocompleteExtension = useMemo(() => {
        switch (language) {
            case 'cpp': return cppLanguage.data.of({ autocomplete: completeAnyWord });
            case 'java': return javaLanguage.data.of({ autocomplete: completeAnyWord });
            case 'python': return pythonLanguage.data.of({ autocomplete: completeAnyWord });
            default: return cppLanguage.data.of({ autocomplete: completeAnyWord });
        }
    }, [language]); // <--- CRITICAL

    const onChange = useCallback((val) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCode(val);
        }, 750);
    }, []);

    return (
        <div className="flex-1 w-full overflow-auto">
            <CodeMirror
                value={code}
                height="100%"
                theme={themeExtension}
                extensions={[langExtension, autocompleteExtension, daisyUiBridge]} 
                onChange={onChange}
                style={{ fontSize: '16px', height: '100%' }}
            />
        </div>
    );
};

export default Editor;