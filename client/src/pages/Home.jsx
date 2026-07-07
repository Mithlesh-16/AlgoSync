import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

const Home = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const createNewRoom = () => {
        const newRoomId = uuidv4();
        navigate(`/room/${newRoomId}`);
    };

const joinRoom = (e) => {
    e.preventDefault();

    if(roomId.trim()){
        navigate(`/room/${roomId}`);
    }
};

return (
    <div className = "min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className = "bg-gray-800 p-8 rounded-lg shadow-lg w-96">
            <h1 className = "text-xl font-bold mb-6 text-center text-blue-400">
                AlgoSync
            </h1>

            <form onSubmit = {joinRoom} className = "flex flex-col gap-4">
                <input 
                type="text" 
                placeholder = "Enter Room ID"
                value = {roomId}
                onChange = {(e) => setRoomId(e.target.value)}
                className = "p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                <button type = "submit" className = "bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition-colors">
                    Join Room
                </button>
            </form>

            <div className = "mt-6 text-center">
                <span className = "text-gray-400 text-sm">
                    Don't have an invite?
                </span>
                <button onClick = {createNewRoom} className = "text-blue-400 hover: underline font-semibold">
                    Create a New Room
                </button>
            </div>
        </div>
    </div>
)
};

export default Home;