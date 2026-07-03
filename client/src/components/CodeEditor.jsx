import React, {useState, useEffect} from 'react';
import Editor from '@monaco-editor/react'
import {socket} from '../socket'

const CodeEditor = () => {
    const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n  //write your code here\nreturn 0;\n}')
    
    const ROOM_ID = "test-room";

    useEffect(() => {
        socket.emit('join_room', ROOM_ID);
    

        socket.on('recieve_code', (newCode) => {
            setCode(newCode);
        });

        return () => {
            socket.off('recieve_code');
        };
    }, []);

    const handleEditorChange = (value) => {
        setCode(value);
        socket.emit('code_change', {roomId: ROOM_ID, code: value});
    };

    return(
        <div className = "h-[80vh] w-full border border-gray-700 rounded-md overflow-hidden">
            <Editor
            height = "100%"
            width = "100%" 
            theme = "vs-dark" 
            language = "cpp" 
            value = {code} 
            onChange = {handleEditorChange}
            options = {{
                minimap: {enabled: false},
                fontSize: 16,
            }}
            />
        </div>
    );
};

export default CodeEditor;