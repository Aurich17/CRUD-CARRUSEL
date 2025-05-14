// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { MediaFormComponent } from './media-form/media-form.component';
// import { MediaListComponent } from './media-list/media-list.component';

// const routes: Routes = [
//   { path: 'media-form', component: MediaFormComponent },
//   { path: 'media-list', component: MediaListComponent },
//   { path: '', redirectTo: '/media-list', pathMatch: 'full' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],  // Usando 'routes' aquí
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MediaFormComponent } from './media-form/media-form.component';
// import { MediaListComponent } from './media-list/media-list.component';

const routes: Routes = [
  // { path: 'media-form', component: MediaFormComponent },
  // { path: 'media-list', component: MediaListComponent },
  // { path: '', redirectTo: '/media-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Usando 'routes' aquí
  exports: [RouterModule]
})
export class AppRoutingModule {}

