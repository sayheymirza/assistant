import { Component, input } from '@angular/core';

@Component({
  selector: 'app-messages',
  imports: [],
  template: `
    @for (item of items(); track $index) {
      @if(item.type == 'message') {
        <p class="p-2 rounded-xl bg-gray-100 text-sm">{{item.data}}</p>
      }
      @if(item.type == 'show-menu') {
        <div class="flex flex-nowrap items-center gap-2 overflow-y-scroll -mx-4 px-4">
          @for (product of item.data; track $index) {
            <div class="min-w-[120px] max-w-[120px] h-full flex flex-col gap-2 p-2 border border-gray-200 rounded-xl">
              <img [src]="product.image" alt="{{product.name}}" class="w-full object-contain aspect-square rounded-lg mb-auto"/>
              <strong class="text-xs">{{product.name}}</strong>
              <span class="text-xs font-semibold text-blue-600">{{product.price}} تومان</span>
            </div>
          }
        </div>
      }
      @if(item.type == 'place-order') {
        <div class="flex flex-col items-center gap-2 bg-green-400 rounded-xl p-4">
          <strong class="text-xl">سفارش شما ثبت شد!</strong>

          <p class="text-sm">به نام {{item.data.customer_name}} با شماره {{item.data.phone_number}}.</p>
        </div>
      }
    }
  `,
  host: {
    class: 'flex flex-col gap-2 p-4'
  }
})
export class Messages {
  public items = input<{ type: string, data: any }[]>([]);
}
