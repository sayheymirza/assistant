import { Component } from '@angular/core';

@Component({
  selector: 'app-wavesurfer',
  imports: [],
  template: `
    <div id="wavesurfer" class="w-full h-5 -mr-1"></div>
  `,
  host: {
    class: 'flex flex-nowrap items-center justify-center w-32 h-8 rounded-full bg-gradient-to-t from-white/10 via-white/20 to-white/10 backdrop-blur overflow-hidden'
  }
})
export class Wavesurfer {

}
