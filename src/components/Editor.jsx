import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp, cppLanguage } from '@codemirror/lang-cpp';
import { java, javaLanguage } from '@codemirror/lang-java';
import { python, pythonLanguage } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { completeAnyWord } from '@codemirror/autocomplete';
import { daisyUiBridge } from '../lib/daisyUiBridge.js';
import useEditorStore from '../store/useEditorStore.js';
import useThemeStore from '../store/useThemeStore.js';
import DAISY_UI_CONSTANTS from '../constants/daisy_ui_contants.js';

// 1. Hoist static styles outside the component to prevent new object references on every render
const EDITOR_STYLES = { fontSize: '16px', height: '100%' };

// 2. Wrap component in React.memo to prevent re-renders triggered by parent components
const Editor = React.memo(() => { 
    // 3. Granular Zustand Subscriptions: 
    // Select specific state slices rather than destructuring the whole store.
    const code = useEditorStore((state) => state.code);
    const setCode = useEditorStore((state) => state.setCode);
    const language = useEditorStore((state) => state.language);
    
    const theme = useThemeStore((state) => state.theme);

    const timerRef = useRef(null);

    // 4. Batch Extensions: Combine logic into a single useMemo block 
    // to prevent passing a newly created array reference to CodeMirror on every render.
    const extensions = useMemo(() => {
        const baseExtensions = [daisyUiBridge];
        
        switch (language) {
            case 'java':
                baseExtensions.push(java(), javaLanguage.data.of({ autocomplete: completeAnyWord }));
                break;
            case 'python':
                baseExtensions.push(python(), pythonLanguage.data.of({ autocomplete: completeAnyWord }));
                break;
            case 'cpp':
            default:
                baseExtensions.push(cpp(), cppLanguage.data.of({ autocomplete: completeAnyWord }));
                break;
        }
        
        return baseExtensions;
    }, [language]);

    const themeExtension = useMemo(() => {
        return theme === DAISY_UI_CONSTANTS.DARK_THEME ? dracula : []; 
    }, [theme]);

    // 5. Stable Dependency: Include setCode in dependencies (Zustand setters are stable, but it's good practice)
    const onChange = useCallback((val) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setCode(val);
        }, 750);
    }, [setCode]);

    // 6. Memory Leak Prevention: Clear timeout if the component unmounts before the debounce fires
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="flex-1 w-full overflow-auto">
            <CodeMirror
                value={code}
                height="100%"
                theme={themeExtension}
                extensions={extensions} 
                onChange={onChange}
                style={EDITOR_STYLES}
            />
        </div>
    );
});

Editor.displayName = 'Editor';

export default Editor;