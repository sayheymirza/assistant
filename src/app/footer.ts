import { NgClass } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [FormsModule, NgClass],
  template: `
    <div 
      (click)="cart.emit()" 
      class="flex flex-col items-center gap-2 transition-all duration-300 ease-in-out group"
    >
      <button class=" bg-gradient-to-br from-emerald-500 to-emerald-600 w-14 h-14 rounded-full flex items-center justify-center transition-all group-active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>
      
      <strong class="opacity-70 text-sm">سبدخرید</strong>
    </div>

    <div class="bg-gradient-to-tr from-white/30 to-white/10 backdrop-blur shadow-xs h-14 grow rounded-full overflow-hidden">
      <textarea
        class="min-h-14 max-h-14 h-14 w-full bg-transparent outline-0 border-0 p-4 placeholder:text-center placeholder:font-bold"
        placeholder="می توانید بنویسید"
        [(ngModel)]="text"
        (ngModelChange)="onTextChange()"
      ></textarea>
    </div>

    <div 
      (click)="end.emit()" 
      class="flex flex-col items-center gap-2 transition-all duration-300 ease-in-out group"
      [ngClass]="{
        '-ml-16 opacity-0 scale-90': focused(),
      }"
    >
      <button class="bg-gradient-to-bl from-red-500 to-red-700 w-14 h-14 rounded-full flex items-center justify-center transition-all group-active:scale-90">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M4.51 15.48l2-1.59c.48-.38.76-.96.76-1.57v-2.6c3.02-.98 6.29-.99 9.32 0v2.61c0 .61.28 1.19.76 1.57l1.99 1.58c.8.63 1.94.57 2.66-.15l1.22-1.22c.8-.8.8-2.13-.05-2.88-6.41-5.66-16.07-5.66-22.48 0-.85.75-.85 2.08-.05 2.88l1.22 1.22c.71.72 1.85.78 2.65.15z"/></svg>
      </button>
      
      <strong class="opacity-70 text-sm">پایان</strong>
    </div>

    <div 
      (click)="send()" 
      class="flex flex-col items-center gap-2 transition-all duration-300 ease-in-out relative -right-2 group"
      [ngClass]="{
        '-ml-16 opacity-0 scale-90': !focused(),
      }"
    >
      <button class="bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center transition-all group-active:scale-90">
        <svg class="-scale-100" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
      </button>
      
    </div>
  `,
  host: {
    class: 'flex flex-nowrap items-start gap-4 w-full'
  }
})
export class Footer {
  public end = output();
  public cart = output();
  public message = output<string>();
  public focused = signal(false);
  public text = signal('');

  public send() {
    if (this.text().trim().length != 0) {
      this.message.emit(this.text().trim());
      this.text.set('');
    }
  }

  public onTextChange() {
    this.focused.set(this.text().trim().length != 0);
  }
}
