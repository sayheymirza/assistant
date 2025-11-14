import { Component } from '@angular/core';
import { Call } from "./views/call";

@Component({
  selector: 'app-root',
  imports: [Call],
  template: `
    <app-call />
  `,
})
export class App {

}
