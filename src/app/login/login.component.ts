import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { SearchResults } from '../models/searchResults.model';
import { environment, backend } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  private response: SearchResults[] = [];
  private errorMessage: any = '';
  private authURL = backend.config.url;

  constructor(private _spotify: SpotifyService) { }

  ngOnInit() {
  }

  login() {
    window.location.href = this.authURL + '/auth/login';
    console.log(window.location.href);
    // this._spotify.getAuth()
    //   .subscribe(
    //     results => console.log(results)
    //   );
    //   console.log(' get auth response ', this.response);
  }

}
