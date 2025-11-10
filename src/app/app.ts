import { Component, inject, signal } from '@angular/core';
import { Footer } from './components/footer';
import { Messages } from './components/messages';
import { Call } from './services/call';

@Component({
  selector: 'app-root',
  imports: [Footer, Messages],
  template: `
  <main class="flex flex-col w-full h-full max-w-3xl mx-auto">
    <app-messages [items]="messages()" class="grow overflow-y-scroll"/>
    <app-footer [status]="status()" (submit)="onSubmit($event)"/>
  </main>
  `,
  host: {
    class: 'block w-screen h-dvh relative overflow-hidden'
  }
})
export class App {
  private call = inject(Call);

  public messages = signal<{ type: string, data: any }[]>([]);
  public status = signal<'connected' | 'connecting' | 'disconnected' | 'empty' | 'error'>('empty');

  ngOnInit() {
    this.call.event.subscribe((event) => {
      if (event.type === 'destroy') {
        this.status.set('disconnected');
        this.messages.set([]);
        return;
      }

      if(event.type == 'hello') {
        this.status.set('connected');
      }

      this.messages.set([...this.messages(), event]);
    });
  }

  public onSubmit(status: 'connect' | 'disconnect') {
    if (status === 'connect' && this.status() !== 'connected') {
      this.status.set('connecting');
      this.call.create().catch(() => {
        this.status.set('error');
      });
    }

    if (status === 'disconnect' && this.status() === 'connected') {
      this.call.destroy();
      this.status.set('disconnected');
    }
  }
}
