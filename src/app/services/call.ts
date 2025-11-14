import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class Call {
  public event = new Subject<{ type: string, data: any }>();
  private socket?: Socket;

  public send(type: string, data: any) {
    if (this.socket) {
      this.socket.emit('data', { type, data });
    }
  }

  public listen() {
    const url = undefined;

    this.socket = io(url, {
      path: '/socket.io',
      transports: ['websocket'],
      upgrade: true,
      autoConnect: true,
      forceNew: true,
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.onAny((event, ...args) => {
      console.log(event, args);
      
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Call service: socket disconnected', reason);
      this.event.next({ type: 'disconnected', data: { reason } });
    });

    this.socket.on('data_back', (event) => {      
      // Emit all events to subscribers
      this.event.next(event);
    });
  }

  public unlisten() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}
