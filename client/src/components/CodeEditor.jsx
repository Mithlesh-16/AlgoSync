import React, {useState, useEffect} from 'react';
import Editor from '@monaco-editor/react'
import {socket} from '../socket'
import {useParams} from 'react-router-dom'

const defaultTemplates = {
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // write your C++ code here\n    return 0;\n}',
    python: '# write your Python code here\nprint("Hello World")',
    javascript: '// write your JavaScript code here\nconsole.log("Hello World");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // write your Java code here\n        System.out.println("Hello World");\n    }\n}'
};

const CodeEditor = () => {
    const {roomId} = useParams();

    const [codes, setCodes] = useState({defaultTemplates});

    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);

    useEffect(() => {
        socket.emit('join_room', roomId);

        socket.on('room_init_state', (state) => {
            setCodes({
                cpp: state.cpp,
                python: state.python,
                java: state.java,
                javascript: state.javascript
            });
            setLanguage(state.currentLanguage);
        })
        
        socket.on('recieve_code', ({language: updatedLanguage, code: updatedCode}) => {
            setCodes(prev => ({...prev, [updatedLanguage]: updatedCode}));
        });

        socket.on('recieve_language', (newLang) => {
            setLanguage(newLang);
        })

        socket.on('recieve_output', (newOutput) => {
            setOutput(newOutput);
        });

        return () => {
            socket.off('room_init_state');
            socket.off('recieve_code');
            socket.off('recieve_language');
            socket.off('recieve_output');
            
        };
    }, [roomId]);

    const handleEditorChange = (value) => {
        setCodes(prev => ({...prev, [language]: value}));
        socket.emit('code_change', {roomId: roomId, language: language, code: value});
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        socket.emit('language_change', {roomId: roomId, language: newLang});
    }

    const runCode = async () => {
        setIsCompiling(true);
        setOutput("Compiling and running in remote sandbox environment...");
    
        try{
            const currentHost = window.location.hostname;
            const response = await fetch(`https://algosync-vqo5.onrender.com/api/compile`, {
                method : 'POST', 
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({code: codes[language], language})
            });
            const data = await response.json();
            setOutput(data.output);
            socket.emit('output_change', {roomId: roomId, output: data.output});
        }
        catch(error){
            const errorMessage = "Network Error : Failed to reach compilation proxy Server.";
            setOutput(errorMessage);
            socket.emit('output_change', {roomId: roomId, output: errorMessage});
        }
        finally{
            setIsCompiling(false);
        }
    };

    return(

        <div className='flex flex-col h-[85vh] gap-4'>
            <div className = 'flex gap-4 items-center'>
                <label className='text-gray-300 font-semibold'>Language : </label>
                <select 
                value = {language}
                onChange = {handleLanguageChange}
                className = "bg-gray-700 text-white p-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
            </div>

            {/* EDITOR */}
            <div className = "flex-grow border-gray-700 rounded-md overflow-hidden">
                <Editor
                  height = "100%"
                  width = "100%"
                  theme = "vs-dark"
                  language = {language}
                  value = {codes[language] || ''}
                  onChange = {handleEditorChange}
                  options = {{
                    minimap : {enabled : false},
                    fontSize : 16,
                  }}
                />
            </div>

            <button 
             onClick = {runCode}
             disabled = {isCompiling}
             className = {`px-6 py-2 rounded font-bold text-white transition-colors 
                ${isCompiling ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
            >
                {isCompiling ? 'Running...': 'Run Code'}
            </button>

            {/* OUTPUT TERMINAL */}
            <div className = "h-40 bg-black border border-gray-700 rounded-md p-4 overflow-y-auto">
                <h3 className = "text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">
                    Console Output
                </h3>
                <pre className = "text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {output || "> Ready..."}
                </pre>
            </div>
        </div>
        
        // <div className = "h-[80vh] w-full border border-gray-700 rounded-md overflow-hidden">
        //     <Editor
        //     height = "100%"
        //     width = "100%" 
        //     theme = "vs-dark" 
        //     language = "cpp" 
        //     value = {code} 
        //     onChange = {handleEditorChange}
        //     options = {{
        //         minimap: {enabled: false},
        //         fontSize: 16,
        //     }}
        //     />
        // </div>
    );
};

export default CodeEditor;