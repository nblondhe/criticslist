import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { backend, environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private authURL = backend.config.url;
  showSpinner = false;

  constructor(private _spotify: SpotifyService) { }

  ngOnInit() {
  }

  login() {
    window.location.href = this.authURL + '/auth/login';
  }
}
