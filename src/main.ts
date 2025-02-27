import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';  // Usa appConfig que ya tiene los proveedores
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
