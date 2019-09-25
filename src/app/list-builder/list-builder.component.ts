import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material';

@Component({
  selector: 'app-list-builder',
  templateUrl: './list-builder.component.html',
  styleUrls: ['./list-builder.component.css']
})
export class ListBuilderComponent implements OnInit {
  reviews = {};
  private accessToken;
  userId;
  error;
  albums: any = [];
  tracks: any = [];
  playlistId;
  displayAlbums = false;
  reviewers = [
    { value: '/pitchfork/pitchfork-album-data', viewValue: 'Pitchfork - 8.0+ Reviews' },
    { value: '/nme/nme-album-data', viewValue: 'NME' },
    { value: '/guardian/guardian-album-data', viewValue: 'The Guardian' },
    // {value: '/metacritic/metacritic-album-data', viewValue: 'Metacritic'}
  ];
  selectedPlaylist = this.reviewers[0].viewValue;

  constructor(
    private _spotify: SpotifyService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
  ) {
    iconRegistry.addSvgIcon(
      'speaker',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/baseline-speaker-24px.svg'
      )
    );
  }

  ngOnInit() {
    this._spotify.backendGet('/auth/get-token').subscribe(res => {
      this.accessToken = res['token'];
    },
      error => {
        if (error) {
          this.error = error;
        }
      },
      () => this.getProfile()
    );
    this.getReviews(this.reviewers[0].value);
  }

  getProfile() {
    this._spotify.sendGet('/me', this.accessToken).subscribe(results => {
      this.userId = results['id'];
    });
  }

  getReviews(reviewLocation) {
    this.displayAlbums = false;
    this.albums = [];
    this.tracks = [];
    this._spotify.backendGet(reviewLocation).subscribe(data => {
      this.reviews = data;
    },
      error => {
        if (error) {
          this.error = error;
        }
      },
      () => this.getAlbums()
    );
  }

  getAlbums() {
    const postData = {
      type: 'album',
      limit: 1
    };

    const albums = Object.values(this.reviews);
    const artists = Object.keys(this.reviews);
    for (let i = 0; i < albums.length; i++) {
      const q = albums[i];
      const type = 'album';
      const limit = 1;
      this._spotify
        .sendGet(`/search?q=${q}&type=${type}&limit=${limit}`, this.accessToken)
        .subscribe(
          result => {
            let spotifyArtist;
            let spotifyAlbum;
            let hasArtistMatch;
            try {
              spotifyArtist = result['albums']['items'][0]['artists'][0]['name'];
              spotifyAlbum = result['albums']['items'][0]['name'];
              hasArtistMatch = this.reviews[spotifyArtist];
            } catch (err) {
              // console.log(`${q} not found in search`);
              // Save in list to display
            }

            if (spotifyAlbum && hasArtistMatch) {
              this.albums.push({
                image: result['albums']['items'][0]['images'][0]['url'],
                id: result['albums']['items'][0]['id'],
                title: spotifyAlbum,
                artist: spotifyArtist
              });
            }
          },
          error => {
            if (error) {
              this.error = error;
            }
          },
          () => {
            this.displayAlbums = true;
          }
        );
    }

  }

  createList() {
    const postData = {
      name: 'Critics List',
      description: 'Weekly album reviews',
      public: false
    };
    this._spotify
      .sendPost(`/users/${this.userId}/playlists`, this.accessToken, postData)
      .subscribe(
        results => {
          this.playlistId = results['id'];
        },
        error => {
          if (error) {
            this.error = error;
          }
        },
        () => this.getTracks()
      );
  }

  getTracks() {
    let subscribeCount = 0;
    const chunkSize = 99;
    Object.entries(this.albums).forEach(([key, value]) => {
      let id;
      if (value['id']) {
        id = value['id'];
        this._spotify
          .sendGet(`/albums/${id}/tracks`, this.accessToken)
          .subscribe(
            result => {
              subscribeCount++;
              result['items'].forEach(element => {
                const last = this.tracks[this.tracks.length - 1];
                if (!last || last.length === chunkSize) {
                  this.tracks.push(['spotify:track:' + element['id']]);
                } else {
                  last.push('spotify:track:' + element['id']);
                }
              });
            },
            error => {
              if (error) {
                this.error = error;
              }
            },
            () => {
              if (subscribeCount === this.albums.length) {
                this.buildList();
              }
            }
          );
      }
    });
  }

  buildList() {
    this.tracks.forEach(segment => {
      const postData = {
        uris: segment
      };
      this._spotify.sendPost(`/users/${this.userId}/playlists/${this.playlistId}/tracks?`, this.accessToken, postData)
        .subscribe(
          results => {
            this.snackBar.open('Critics List added successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          },
          error => {
            if (error) {
              this.error = error;
            }
          }
        );
    });
  }

  removeAlbum(album) {
    for (let i = 0; i < this.albums.length; i++) {
      if (album === this.albums[i]) {
        if (i !== -1) {
          this.albums.splice(i, 1);
        }
      }
    }
  }
}
