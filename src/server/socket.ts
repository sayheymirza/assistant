import 'dotenv/config';

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { Server as IOServer } from 'socket.io';

import { memory } from './memory';
import { call } from './ollama';
import { tts } from './tts';

const server = http.createServer();

server.listen(process.env['SOCKET_PORT'] || 3200, () => {
    console.log(`Socket.IO server listening on port ${process.env['SOCKET_PORT'] || 3200}`);
});

const io = new IOServer(server, {
    path: '/socket.io',
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket'],
    perMessageDeflate: false, 
    serveClient: false,
    allowEIO3: true,
    maxHttpBufferSize: 1e8 // 100MB for large audio files
});

io.engine.on('initial_headers', (headers, req) => {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Credentials'] = 'true';
});

io.on('connection', (socket) => {
    memory[socket.id] = [
        {
            type: 'message',
            data: {
                role: 'system',
                text: `تو یک دستیار هوشمند برای کافی شاب هستی.`,
            }
        }
    ];

    // emit the socket id to the client
    socket.emit('data_back', { type: 'connected', data: { socket_id: socket.id } });

    socket.on('disconnect', () => {
        delete memory[socket.id];
    });

    socket.on('data', async (event) => {
        const { type, data } = event;

        if (type == 'message') {
            memory[socket.id].push({
                type: 'message',
                data: {
                    role: 'user',
                    text: data.text,
                    timestamp: Date.now(),
                    tts: true,
                }
            });

            // echo the message back to the client
            socket.emit('data_back', {
                type: 'message',
                data: {
                    role: 'user',
                    text: data.text,
                    timestamp: Date.now(),
                    tts: true,
                },
            });

            const response = await call(memory[socket.id]);

            if (response) {
                memory[socket.id].push(response);
                socket.emit('data_back', response);

                const result = await tts(response.data.text);
                
                if(result) {
                    const filename = `${response.data.timestamp || Date.now()}.wav`;
                    const filepath = path.join(process.env["CACHE_DIRECTORY"] || path.join(import.meta.dirname, '../cache'), filename);

                    fs.writeFileSync(filepath, result);

                    socket.emit('data_back', {
                        type: 'speech',
                        data: {
                            filename: `/${filename}`,
                            timestamp: response.data.timestamp,
                        },
                    });

                    // 5 minute timeout to delete the audio file
                    const timeout = 5 * 60 * 1000; // 5 minutes in milliseconds

                    setTimeout(() => {
                        fs.rmSync(filepath);
                    }, timeout);
                }
            }
        }
    });
});

io.engine.on('connection_error', (err) => {
    console.log('Socket.IO: connection error', err.req, err.code, err.message, err.context);
});