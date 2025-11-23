import { Component, signal } from '@angular/core';
import { Call } from "./call";

@Component({
  selector: 'app-root',
  imports: [Call],
  template: `
    @if(isPWA() == true) {
      <app-call />
    }

    @if(isPWA() == false) {
      <div class="flex flex-col items-center justify-center h-screen w-screen">
        <strong class="text-8xl">PWA</strong>
        <span class="opacity-70">Please add to home screen</span>
      </div>
    }
  `
})
export class App {
  public isPWA = signal<boolean | null>(null);

  ngAfterViewInit() {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true || (window.location.hostname == 'localhost')) {
      this.isPWA.set(true);
    } else {
      this.isPWA.set(false);
    }
  }
}
