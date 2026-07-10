import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeMk from '@angular/common/locales/mk';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Register Macedonian locale so number formatting uses "." for thousands
// (e.g. 27.500) and "," for decimals. Applied per-pipe via the 'mk' locale
// argument; the global LOCALE_ID stays default so dates are unaffected.
registerLocaleData(localeMk);

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
