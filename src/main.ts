import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(MatNativeDateModule),
  ],
});


// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
