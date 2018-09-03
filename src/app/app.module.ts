import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { DisplaydataComponent } from './displaydata/displaydata.component';
import { SpotifyService } from './spotify.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatProgressSpinnerModule
} from '@angular/material';

export const spotifySettings = environment.config;

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    DisplaydataComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],

  providers: [SpotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
