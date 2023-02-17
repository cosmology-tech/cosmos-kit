import { SessionOptions } from '../types';

export class Session {
  sesessionOptions: SessionOptions;
  timeoutId?: string | number | NodeJS.Timeout;

  constructor(sessionOptions: SessionOptions) {
    this.sesessionOptions = sessionOptions;
  }

  update() {
    if (typeof this.timeoutId !== 'undefined') {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.sesessionOptions.callback?.();
    }, this.sesessionOptions.duration);
  }
}
