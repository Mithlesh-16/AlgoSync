import {io} from 'socket.io-client';

const currentHost = window.location.hostname;
const SERVER_URL = `http://${currentHost}:5000`;

export const socket = io(SERVER_URL, {
    // transports: ['websocket'],
    reconnectionAttempts: 5,
});