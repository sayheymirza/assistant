import { NgClass } from '@angular/common';
import { Component, computed, Input, output, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  template: `
    <div class="flex flex-nowrap items-center justify-between gap-4 relative">
      <div class="block min-w-28">
        @if(status() != 'empty' && status() != 'disconnected') {
          <div class="flex flex-nowrap items-center gap-2">
            <span class="w-2 h-2 rounded-full"
            [class.bg-green-500]="status() === 'connected'"
            [class.bg-yellow-500]="status() === 'connecting'"
            [class.bg-red-500]="status() === 'disconnected' || status() === 'error'"
            ></span>
            <span class="text-sm">
              @switch(status()) {
                @case('connected') {
                  متصل
                }
                @case('connecting') {
                  در حال اتصال...
                }
                @case('disconnected') {
                  قطع شده
                }
                @case('error') {
                  خطایی رخ داد
                }
              }
            </span>
          </div>
        }
      </div>

      <div class="flex flex-col items-center">
        <div 
          [class.hidden]="status() != 'empty'"
          class="p-4 w-96 flex flex-col gap-4 border border-white bg-gradient-to-br from-blue-50 via-white to-white rounded-2xl shadow-lg shadow-blue-50 absolute bottom-24
          after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-20 after:border-r-20 after:border-t-20 after:border-l-transparent after:border-r-transparent after:border-t-white"
        >
          <div class="absolute top-0 right-0 left-0 h-32 overflow-hidden rounded-t-2xl">
            <div class="bg-tiles bg-size-[30px] h-full z-0"></div>
            <div class="bg-gradient-to-tl from-white to-transparent absolute inset-0 z-1"></div>
          </div>

          <div class="flex flex-nowrap items-center gap-6 z-1">
            <div class="bg-blue-500 w-12 h-12 flex items-center justify-center rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><g><g><path d="M19.46,8l0.79-1.75L22,5.46c0.39-0.18,0.39-0.73,0-0.91l-1.75-0.79L19.46,2c-0.18-0.39-0.73-0.39-0.91,0l-0.79,1.75 L16,4.54c-0.39,0.18-0.39,0.73,0,0.91l1.75,0.79L18.54,8C18.72,8.39,19.28,8.39,19.46,8z M11.5,9.5L9.91,6 C9.56,5.22,8.44,5.22,8.09,6L6.5,9.5L3,11.09c-0.78,0.36-0.78,1.47,0,1.82l3.5,1.59L8.09,18c0.36,0.78,1.47,0.78,1.82,0l1.59-3.5 l3.5-1.59c0.78-0.36,0.78-1.47,0-1.82L11.5,9.5z M18.54,16l-0.79,1.75L16,18.54c-0.39,0.18-0.39,0.73,0,0.91l1.75,0.79L18.54,22 c0.18,0.39,0.73,0.39,0.91,0l0.79-1.75L22,19.46c0.39-0.18,0.39-0.73,0-0.91l-1.75-0.79L19.46,16 C19.28,15.61,18.72,15.61,18.54,16z"/></g></g></svg>
            </div>

            <strong class="text-lg">میرزا به عنوان دستیار</strong>
          </div>

          <p class="text-base text-gray-600 leading-relaxed p-2 z-1">
            یک دستیار با قدرت گرفته از هوش مصنوعی که یک سری ابزار های خاص رو با قدرت صدای شما اجرا میکنه. کافیه دستور بدی!
          </p>

          <ul class="text-[12px] flex flex-col gap-1">
            <li class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">خرید قهوه از قهوه فیکا</li>
            <li class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">جستجو در گوگل</li>
            <li class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full w-fit">تاریخ امروز</li>
          </ul>
        </div>

        <button 
          (click)="onSubmit()"
          type="button" class="rounded-full font-bold cursor-pointer size-18 bg-radial-[at_50%_85%]  to-90% shadow-2xl text-white/90 transition-all active:scale-95 hover:scale-105"
          [ngClass]="{
            'to-blue-300 via-blue-500 from-blue-800 shadow-blue-600': status() === 'disconnected' || status() === 'empty',
            'to-green-300 via-green-500 from-green-800 shadow-green-600': status() === 'connected',
            'to-amber-300 via-amber-500 from-amber-800 shadow-amber-600 animate-pulse': status() === 'connecting',
            'to-red-300 via-red-500 from-red-800 shadow-red-600': status() === 'error'
          }"
        >
          @if(status() === 'disconnected' || status() === 'empty') {
            شروع
          }
          @if (status() === 'connected') {
            پایان
          }
          @if (status() === 'error') {
            تلاش
          }
      </button>
    </div>

      <span class="block text-sm min-w-28 text-left">
        @if(status() === 'connected') {
          {{timer()}}&nbsp;
        }
      </span>
    </div>
  `,
  host: {
    class: 'flex flex-col gap-4 bg-gradient-to-t from-white to-transparent pb-10 px-10'
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
