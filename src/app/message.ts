import { Component, input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: `
    @if(item()) {
      @if(item()!.type === 'message') {
        <div 
          class="bg-gradient-to-br from-black/8 to-black/12 p-2.5 rounded-xl max-w-xs w-full min-w-56 animate-fade-in">
          <p class=" whitespace-break-spaces">{{item()!.content}}</p>
        </div>
      }
    }
      
  `,
  host: {
    class: 'flex items-center justify-center w-full'
  },
})
export class Message {
  public item = input<Item | undefined>();
}

interface Item {
  type: 'message' | 'product' | 'products';
  content: any;
}