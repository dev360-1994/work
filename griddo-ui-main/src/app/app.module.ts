import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './http-interceptors';
import { SessionExpiresModule } from './modules/session-expires/session-expires.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { registerLocaleData } from '@angular/common';
import locale_canada from '@angular/common/locales/en-CA';
import { getQueryParameterByName } from './constants';
// import locale_french_france from '@angular/common/l/ocales/fr';

// import('@angular/common/locales/en-CA')
//   .then(lang => registerLocaleData(lang.default));

registerLocaleData(locale_canada);


const localeInQuery: string | null = getQueryParameterByName('locale');

const locale = navigator.language === 'en-CA' || localeInQuery?.toLowerCase() === "canada" ? 'en-CA' : 'en-US';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SessionExpiresModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        duration: 5000
      }
    },
    { provide: LOCALE_ID, useValue: locale },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
