// import { ApplicationConfig } from '@angular/core';
// import { provideRouter, Routes } from '@angular/router';
// import { MediaFormComponent } from './media-form/media-form.component';
// import { MediaListComponent } from './media-list/media-list.component';

// // Asegúrate de que 'routes' sea de tipo 'Routes'
// const routes: Routes = [
//   { path: 'media-form', component: MediaFormComponent },
//   { path: 'media-list', component: MediaListComponent },
//   { path: '', redirectTo: '/media-list', pathMatch: 'full' }
// ];

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes)]  // Usando 'provideRouter' aquí
// };


import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { provideHttpClient } from '@angular/common/http';
// import { MediaFormComponent } from './media-form/media-form.component';
// import { MediaListComponent } from './media-list/media-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

const routes: Routes = [
  // { path: 'media-form', component: MediaFormComponent },
  // { path: 'media-list', component: MediaListComponent },
  { path: '', redirectTo: '/media-list', pathMatch: 'full' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),  // Asegúrate de que provideHttpClient esté en los proveedores
    HttpClientModule  // Asegúrate de que HttpClientModule esté en los proveedores
  ]
};
