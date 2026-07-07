import React from 'react';
import CodeEditor from './components/CodeEditor';
// import {socket} from './socket';
import Home from './pages/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route 
          path = "/room/:roomId"
          element = {
            <div className = "min-h-screen bg-gray-900 text-white flex flex-col">
              <header className = "p-4 bg-gray-800 shadow-md">
                <h1 className = "text-xl font-bold text-blue-400">
                  AlgoSync Workspace
                </h1>
              </header>
              <main className = "flex-grow p-4">
                <CodeEditor />
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// function App() {
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Successfully connected to the AlgoSync Server! Socket ID: ', socket.id);
//     });
//     return () => {
//       socket.off('connect');
//     };
//   }, []);
//   return (
//     <div className = "min-h-screen bg-gray-900 text-white flex flex-col">
//       <header className = "p-4 bg-gray-800 shadow-md">
//         <h1 className = "text-xl font-bold">
//           AlgoSync Workspace
//         </h1>
//       </header>
//       <main className = "flex-grow p-4">
//         <CodeEditor/>
//       </main>
//     </div>
//   );
// }

// export default App;


