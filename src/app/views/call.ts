import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Avatar } from "../components/avatar";
import { Footer } from '../components/footer';
import { Messages } from '../components/messages';
import { Call as CallService } from '../services/call';
import { STT } from '../services/stt';

@Component({
  selector: 'app-call',
  imports: [Footer, Messages, Avatar, NgClass],
  template: `
  <main class="flex flex-col items-center w-full h-full relative">
    <div 
      class="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t to-transparent -z-1 transition-all"
      [ngClass]="{
        'from-warning': status() === 'connecting',
        'from-primary': status() === 'empty' || status() === 'disconnected',
        'from-success': status() === 'connected',
        'from-error': status() === 'error'
      }"
    ></div>

    <app-avatar class="mt-20"/>
    <app-messages [items]="messages()" class="grow w-full overflow-y-scroll -mb-12"/>
    <app-footer [status]="status()" (submit)="onSubmit($event)"/>
  </main>
  `,
  host: {
    class: 'block w-screen h-dvh relative overflow-hidden'
  }
})
export class Call {
  private call = inject(CallService);
  private stt = inject(STT);

  public messages = signal<{ type: string, data: any }[]>([]);
  public status = signal<'connected' | 'connecting' | 'disconnected' | 'empty' | 'error'>('empty');

  private audio?: HTMLAudioElement;

  ngOnInit() {
    this.call.event.subscribe((event) => {
      if (event.type === 'destroy') {
        this.status.set('disconnected');
        this.messages.set([]);
        return;
      }

      if (event.type == 'hello') {
        this.status.set('connected');
      }

      if (event.type === 'connected') {
        this.status.set('connected');
        this.listenToSTT();
      }

      if (event.type === 'error') {
        this.status.set('error');
      }

      if (event.type === 'disconnected') {
        this.call.unlisten();
        this.stt.unlisten();
        this.status.set('disconnected');
      }

      if(event.type == 'speech') {
        const url = "/cache/"+event.data.filename;
        
        this.audio = new Audio(url);
        this.audio.play();

        this.audio!.onended = () => {
          this.listenToSTT();
        }

        this.audio!.onerror = () => {
          this.listenToSTT();
        }

        this.audio!.onplay = () => {
          this.stt.unlisten();
        };
      }

      // Only add non-audio events to messages to avoid UI clutter
      this.messages.set([...this.messages(), event]);
    });
  }

  public onSubmit(status: 'connect' | 'disconnect') {
    if (status === 'connect' && this.status() !== 'connected') {
      this.status.set('connecting');
      this.call.listen();
    }

    if (status === 'disconnect' && this.status() === 'connected') {
      this.call.unlisten();
      this.stt.unlisten();
      this.status.set('disconnected');

      this.audio?.pause();
      this.audio = undefined;
    }
  }

  private listenToSTT() {
    this.stt.listen().subscribe((value) => {
      this.call.send('message', {
        text: value,
      })
    });
  }
}
