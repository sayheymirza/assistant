import { Component } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  template: `
    <div
      class="rounded-full w-28 h-28 relative bg-radial-[at_50%_75%] from-sky-300 via-blue-400 to-indigo-900 shadow-2xl shadow-blue-300"
    >
      <div class="flex flex-nowrap items-center gap-4 absolute top-6 left-1/2 -translate-x-1/2">
        <div class="w-3 h-6 rounded-2xl bg-white"></div>
        <div class="w-3 h-6 rounded-2xl bg-white"></div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Avatar {

}
