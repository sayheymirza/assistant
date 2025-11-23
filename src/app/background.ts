import { Component } from '@angular/core';

@Component({
  selector: 'app-background',
  imports: [],
  template: `
    <div class="absolute inset-0 bg-gradient-to-b from-white to-60% to-[#E2C9AC]"></div>

    <div style="animation-delay: 5s;" class="animate-circular bg-radial from-[#D79E56] to-transparent w-96 h-96 scale-150 rounded-full absolute -bottom-10 -right-20 blur-xl"></div>
    <div class="animate-circular bg-radial from-[#5E6E55] to-transparent w-88 h-88 scale-110 rounded-full absolute -bottom-20 -left-20 blur-xl"></div>

    <div class="fixed inset-0 z-1 bg-white/10 backdrop-blur"></div>
  `,
  host: {
    class: 'fixed inset-0 overflow-hidden -z-1'
  }
})
export class Background {

}
