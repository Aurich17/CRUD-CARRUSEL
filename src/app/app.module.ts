import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { ButtonModule } from 'primeng/button';
import { AppComponent } from './app.component';
import { MessageService} from 'primeng/api/messageservice';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

// BrowserModule ya no es necesario aquí

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    // HttpClientModule
    // BrowserModule // Puedes seguir importando tu componente standalone aquí
  ],
  providers: [MessageService,ConfirmationService]


})
export class AppModule {

    constructor(private primengConfig: PrimeNGConfig) {
      this.primengConfig.ripple = true;
    }

 }

// bootstrapApplication(AppComponent);
