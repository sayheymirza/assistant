import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class STT {
  private listening = false;
  private recognition: any;

  public listen() {
    const subject = new Subject();
    this.listening = true;

    // speech to text
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
    this.recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
    this.recognition.lang = 'fa-IR';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    // recognition.continuous = true; // Enable continuous listening

    this.recognition.onresult = (event: any) => {
      // last result       
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      subject.next(transcript);
    };

    this.recognition.onerror = (event: any) => {
      // Don't error out on 'no-speech' errors, just restart
      if (event.error === 'no-speech' && this.listening) {
        this.recognition.start();
      } else {
        subject.error(event.error);
      }
    };

    this.recognition.onend = () => {
      // Automatically restart recognition if still listening
      if (this.listening) {
        this.recognition.start();
      } else {
        subject.complete();
      }
    };

    this.recognition.start();

    return subject.asObservable();
  }

  public unlisten() {
    this.listening = false;
    this.recognition.stop();
  }
}
