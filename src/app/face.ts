import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-face',
  imports: [NgClass],
  template: `
    <div 
      class="flex flex-col items-center justify-center gap-5 transition-all duration-500 ease-in-out"
      [ngClass]="{'rotate-12': style() == 'responsed'}"
    >
      <div class="flex flex-nowrap items-center gap-6 h-10">
        <div 
          class="rounded-2xl w-3.5 bg-black transition-all duration-200 ease-out"
          [ngClass]="{'h-8.5': eye() == 'closed', 'h-10': eye() == 'open'}"
        ></div>
        <div 
          class="rounded-2xl w-3.5 bg-black transition-all duration-200 ease-out"
          [ngClass]="{'h-8.5': eye() == 'closed', 'h-10': eye() == 'open'}"
        ></div>
      </div>

      <!-- smile svg -->
      <svg 
        class="scale-110 transition-all duration-500 ease-in-out" 
        width="64" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg"
        [ngClass]="{'scale-125': style() == 'responsed'}"
      >
        <path d="M8 16C16 28 48 28 56 16" stroke="black" stroke-width="11" stroke-linecap="round"/>
      </svg>
    </div>
  `,
  styles: ``,
})
export class Face {
  public style = input<'normal' | 'responsed'>('normal');
  public eye = signal<'open' | 'closed'>('open');

  ngOnInit() {
    this.alive();
  }

  private async alive() {
    await this.blink(4000);
    await this.blink(3000);
    await this.blink(5000);
    this.alive();
  }

  private blink(timeout: number) {
    return new Promise<void>((resolve) => {
      this.eye.set('closed');
      setTimeout(() => {
        this.eye.set('open');
      }, 300);
      setTimeout(() => {
        resolve();
      }, timeout + 300);
    });
  }
}
