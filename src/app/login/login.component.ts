import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { backend } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  private authURL = backend.config.url;

  constructor(private _spotify: SpotifyService) { }

  ngOnInit() {
  }

  login() {
    window.location.href = this.authURL + '/auth/login';
  }

}
