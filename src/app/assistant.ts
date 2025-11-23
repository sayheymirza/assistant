import { Injectable, signal } from '@angular/core';
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

@Injectable({
  providedIn: 'root',
})
export class Assistant {
  public incall = signal(false);
  private wavesurfer: WaveSurfer | null = null;

  public async start() {
    if (this.incall()) return;

    if (!this.wavesurfer) {
      const element = document.getElementById('wavesurfer');

      this.wavesurfer = WaveSurfer.create({
        container: element!,
        waveColor: '#ffffffaa',
        progressColor: 'transparent',
        height: 20,
        autoCenter: true,
        barHeight: 3.5, // scale mic amplitude so quiet speech doesn't max-out the bars
        barWidth: 3,
        barGap: 3,
        barRadius: 8,
      });

      const record = this.wavesurfer.registerPlugin(
        RecordPlugin.create({
          scrollingWaveform: false,
          continuousWaveform: false,
        }),
      );

      await record.startRecording();
    }

    this.incall.set(true);
  }

  public end() {
    this.incall.set(false);
    this.wavesurfer?.destroy();
    this.wavesurfer = null;
  }
}
