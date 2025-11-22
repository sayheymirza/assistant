import { Component, computed, inject, signal } from '@angular/core';
import { Face } from './face';
import { Wavesurfer } from "./wavesurfer";
import { Assistant } from './assistant';
import { Message } from "./message";
import { Footer } from "./footer";

@Component({
  selector: 'app-root',
  imports: [Face, Wavesurfer, Message, Footer],
  template: `
    <strong class="text-4xl">{{time()}}</strong>

    <app-face class="block my-10" [style]="faceStyle()"/>

    <app-message [item]="response()"/>

    <div class="flex-1"></div>

    <footer class="fixed bottom-4 left-0 right-0 flex flex-col items-center justify-center gap-4 p-4">
      <app-wavesurfer />
      
      <app-footer 
        (end)="end()"
      />
    </footer>
  `,
  host: {
    class: 'w-full h-full min-h-full flex flex-col items-center gap-4 pt-20'
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
