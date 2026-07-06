import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environment/environment';
import { ENVIRONMENT } from './core/tokens/environment.token';
import { QUOTE_CURRENCY } from './core/tokens/quote-currency.token';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: ENVIRONMENT, useValue: environment },
    { provide: QUOTE_CURRENCY, useValue: 'USDT' },
  ],
};
