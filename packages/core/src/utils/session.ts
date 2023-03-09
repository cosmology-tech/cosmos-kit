import { SessionOptions } from '../types';

export class Session {
  sessionOptions: SessionOptions;
  timeoutId?: string | number | NodeJS.Timeout;

  constructor(sessionOptions: SessionOptions) {
    this.sessionOptions = sessionOptions;
  }

  update() {
    if (typeof this.timeoutId !== 'undefined') {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.sessionOptions.callback?.();
    }, this.sessionOptions.duration);
  }
}
