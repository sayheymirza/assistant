import { NgClass } from '@angular/common';
import { Component, computed, Input, output, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  template: `
    <footer
      class="flex flex-col items-center justify-end h-44 p-4 pb-safe pt-safe">
      <div 
        class="mb-10 flex flex-nowrap items-center justify-center gap-4 w-full max-w-lg"
      >
        <button 
          (click)="onSubmit()" 
          class="btn btn-xl rounded-full text-base"
          [ngClass]="{
            'btn-warning': status() === 'connecting',
            'btn-primary': status() === 'empty' || status() === 'disconnected',
            'btn-success': status() === 'connected',
            'btn-error': status() === 'error'
          }"
        >
          <span [ngClass]="{'hidden': status() !== 'empty' && status() !== 'disconnected'}">
            شروع کنید
          </span>
          <span [ngClass]="{'hidden': status() !== 'connecting'}">
            در حال اتصال
          </span>
          <span [ngClass]="{'hidden': status() !== 'connected'}">
            پایان
          </span>
          <span [ngClass]="{'hidden': status() !== 'error'}">
            تلاش مجدد
          </span>
        </button>
      </div>  
    </footer>
  `,
  host: {
    class: 'block w-full'
  }
})
export class Footer {
  @Input({ alias: 'status' })
  public set _status(value: 'connected' | 'connecting' | 'disconnected' | 'empty' | 'error') {
    this.status.set(value);
    if (value === 'connected') {
      this.startTimer();
    } else {
      clearInterval(this.interval);
      this.seconds.set(0);
    }
  }

  public submit = output<'connect' | 'disconnect'>();

  public status = signal('empty'); // 'connected' | 'connecting' | 'disconnected' | 'empty' | 'error'
  private seconds = signal(0);

  public timer = computed(() => {
    // format seconds as mm:ss
    const mins = Math.floor(this.seconds() / 60).toString().padStart(2, '0');
    const secs = (this.seconds() % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  });

  private interval: any;

  public onSubmit() {
    if (this.status() == 'disconnected' || this.status() == 'empty' || this.status() == 'error') {
      this.submit.emit('connect');
    }
    if (this.status() == 'connected') {
      this.submit.emit('disconnect');
    }
  }

  private startTimer() {
    clearInterval(this.interval);
    this.seconds.set(0);
    this.interval = setInterval(() => {
      this.seconds.set(this.seconds() + 1);
    }, 1000);
  }
}
