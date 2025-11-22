import { Component, computed, inject, signal } from '@angular/core';
import { Face } from './face';
import { Wavesurfer } from "./wavesurfer";
import { Assistant } from './assistant';
import { Message } from "./message";

@Component({
  selector: 'app-root',
  imports: [Face, Wavesurfer, Message],
  template: `
    <strong class="text-4xl">{{time()}}</strong>

    <app-face class="block my-10" [style]="faceStyle()"/>

    <app-message [item]="response()"/>

    <div class="flex-1"></div>

    <app-wavesurfer />
    
    <div (click)="end()" class="flex flex-col items-center gap-4">
      <button class="bg-red-500 w-14 h-14 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.51 15.48l2-1.59c.48-.38.76-.96.76-1.57v-2.6c3.02-.98 6.29-.99 9.32 0v2.61c0 .61.28 1.19.76 1.57l1.99 1.58c.8.63 1.94.57 2.66-.15l1.22-1.22c.8-.8.8-2.13-.05-2.88-6.41-5.66-16.07-5.66-22.48 0-.85.75-.85 2.08-.05 2.88l1.22 1.22c.71.72 1.85.78 2.65.15z"/></svg>
      </button>

      <strong class="opacity-70 text-sm">پایان</strong>
    </div>
  `,
  host: {
    class: 'relative w-vw h-vh flex flex-col items-center gap-4 p-10'
  }
})
export class App {
  private assistant = inject(Assistant);

  public time = signal('0:00');
  public response = signal<any>(null);

  public faceStyle = computed(() => {
    return this.response() ? 'responsed' : 'normal';
  });

  ngOnInit() {
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.time.set(`${hours}:${minutes}`);
    }, 1000);

    // Simulate a response after 5 seconds
    setTimeout(() => {
      this.response.set({ type: 'message', content: 'سلام 👋\nچطور می تونم بهت کمک کنم؟\nمثلا می تونی بگی : من یک دونه اسپرسو دبل می خواهم' });
    }, 5000);

    setTimeout(() => {

      this.assistant.start().then(() => {
        console.log('Recording started');
      });
    }, 100);
  }

  public end() {
    this.assistant.end();
  }
}
