const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const roomStates = {};

const defaultTemplates = {
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // write your C++ code here\n    return 0;\n}',
    python: '# write your Python code here\nprint("Hello World")',
    javascript: '// write your JavaScript code here\nconsole.log("Hello World");',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // write your Java code here\n        System.out.println("Hello World");\n    }\n}'
}

app.get('/', (req, res) => {
    res.send("AlgoSync Server is Running..!");
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        
        if(!roomStates[roomId]){
            roomStates[roomId] = {...defaultTemplates, currentLanguage: 'cpp'};
        }

        socket.emit('room_init_state', roomStates[roomId]);

    });

    socket.on('code_change', ({roomId, language, code}) => {
        if(roomStates[roomId]){
            roomStates[roomId][language] = code;
            socket.to(roomId).emit('recieve_code', {language, code});
        }
    })

    socket.on('language_change', ({roomId, language}) => {
        if(roomStates[roomId]){
            roomStates[roomId].currentLanguage = language;
            socket.to(roomId).emit('recieve_language', language);
        }
    });

    socket.on('output_change', ({roomId, output}) => {
        socket.to(roomId).emit('recieve_output', output);
    })

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

const axios = require('axios');

app.post('/api/compile', async (req, res) => {
    const {code, language} = req.body;

    const languageMap = {
        "cpp": {language: "cpp17", versionIndex: "1"},
        "python": {language: "python3", versionIndex: "4"},
        "javascript": {language: "nodejs", versionIndex: "4"},
        "java": {language: "java", versionIndex: "4"}
    }

    const selectLang = languageMap[language] || languageMap["cpp"];
    try{
        const response = await axios.post("https://api.jdoodle.com/v1/execute", {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: code,
            language: selectLang.language,
            versionIndex: selectLang.versionIndex
        });

        const output = response.data.output || "Execution Successful ...!!";
        res.json({success: true, output});
    }
    catch(error){
        const exactError = error.response ? error.response.data: error.message;
        console.error("JDOODLE API Error: ", exactError);

        res.status(500).json({success: false, output: "Server Error: Failed to communicate with JDOODLE Compiler!!"})
    }
    
})

// app.post('/api/compile', async(req, res) => {
//     const {code, language} = req.body;

//     //----------- for piston public API -------------//

//     const languageMap = {
//         "cpp": {language: "c++", version: "10.2.0"},
//         "python": {language: "python", version: "3.10.0"},
//         "javascript": {language: "javascript", version: "18.15.0"},
//         "java": {language: "java", version: "15.0.2"} 
//     };

//     const selectedConfig = languageMap[language] || languageMap["cpp"];

//     try{
//         const response = await axios.post("https://emkc.org/api/v2/piston/execute",{
//             language: selectedConfig.language,
//             version: selectedConfig.version,
//             files: [
//                 {
//                     content: code
//                 }
//             ],
//         });
//         const runResult = response.data.run;
//         const output = runResult.stderr || runResult.stdout || "Execution Successful...!!";

//         res.json({success: true, output});
//     }
//     catch(error){
//         const exactError = error.response ? error.response.data: error.message;
//         console.error("Piston API Error: ", exactError);
//         res.status(500).json({success: false, output: "Server Error: Failed to Compile Code..!"})
//     }

//     //----------- for judge0 API --------------// 

//     // let languageId = 54;
//     // if(language === 'python') languageId = 71;
//     // if(language === 'javascript') languageId = 63;
//     // if(language === 'java') languageId = 62;

//     // try{
//     //     const options ={
//     //         method : 'POST',
//     //         url : 'https://judge0-ce.p.rapidapi.com/submissions',
//     //         params : {base64_encoded : 'false', wait: 'true'},
//     //         headers: {
//     //             'x-rapidapi-key' : process.env.JUDGE0_API_KEY,
//     //             'x-rapidapi-host' : process.env.JUDGE0_API_HOST,
//     //             'Content-Type' : 'application/json'
//     //         },
//     //         data : {
//     //             source_code : code,
//     //             language_id : languageId,
//     //         }
//     //     };
//     //     const response = await axios.request(options);
//     //     const output = response.data.stdout || response.data.stderr || 
//     //         response.data.compile_output || "Execution Successful ..!!";
//     //     res.json({success : true, output});
//     // } catch(error) {
//     //     console.error("Compilation Proxy Error : ", error.message);
//     //     res.status(500).json({success : false, output : "Server Error : Failed to communincate with the compiler Sandbox."});
//     // }
// });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});