import {io} from 'socket.io-client';

const SERVER_URL = `https://algosync-vqo5.onrender.com`;

export const socket = io(SERVER_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
});