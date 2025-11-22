import { Component } from '@angular/core';

@Component({
  selector: 'app-wavesurfer',
  imports: [],
  template: `
    <div id="wavesurfer" class="w-full h-5 -mr-1"></div>
  `,
  host: {
    class: 'flex flex-nowrap items-center justify-center w-32 h-8 rounded-full bg-black/10 overflow-hidden'
  }
})
export class Wavesurfer {

}
