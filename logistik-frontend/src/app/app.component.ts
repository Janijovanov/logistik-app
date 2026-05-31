import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent {
  constructor() {
    const translate = inject(TranslateService);
    const lang = localStorage.getItem('lang') ?? 'mk';
    translate.use(lang);
  }
}
