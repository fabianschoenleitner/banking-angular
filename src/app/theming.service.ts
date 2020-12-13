import { ApplicationRef, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ThemingService {
  themes = ['light-theme', 'dark-theme'];
  theme = new BehaviorSubject('light-theme');

  constructor(private ref: ApplicationRef) {
    const darkOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (darkOn) {
      this.theme.next('dark-theme');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      const switchControl = e.matches;
      this.theme.next(switchControl ? 'dark-theme' : 'light-theme');
    });
    this.ref.tick();
  }
}
