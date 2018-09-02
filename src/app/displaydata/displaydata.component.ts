import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { SearchResults } from '../models/searchResults.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {TooltipPosition} from '@angular/material';

@Component({
  selector: 'app-displaydata',
  templateUrl: './displaydata.component.html',
  styleUrls: ['./displaydata.component.css']
})
export class DisplaydataComponent implements OnInit {
  data;
  private accessToken;
  userId;
  error;
  albums: any = [];
  tracks: any = [];
  playlistId;

  constructor(
    private _spotify: SpotifyService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar
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
    this.getData();
  }

  getProfile() {
    this._spotify.sendGet('/me', this.accessToken).subscribe(results => {
      this.userId = results['id'];
    });
  }

  getData() {
    this._spotify.backendGet('/publications/album-data').subscribe(data => {
      this.data = data;
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
    Object.entries(this.data).forEach((element) => {
      const q = element[1]['album'];
      const type = 'album';
      const limit = 1;
      this._spotify
        .sendGet(`/search?q=${q}&type=${type}&limit=${limit}`, this.accessToken)
        .subscribe(
          result => {
            try {
            this.albums.push({
              image: result['albums']['items'][0]['images'][0]['url'],
              id: result['albums']['items'][0]['id']
            });
            } catch (err) {
              // console.log(`${q} not found in search`);
              // Save in list to display
            }
          },
          error => {
            if (error) {
              this.error = error;
            }
          }
        );
    });
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
                // this.tracks.push('spotify:track:' + element['id']);
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

  // getAlbumsAndTracks() {
  //   const postData = {
  //     type: 'album',
  //     limit: 1
  //   };
  //   Object.entries(this.data).forEach(([key, value]) => {
  //     const q = value;
  //     const type = 'album';
  //     const limit = 1;
  //     this._spotify
  //       .sendGet(`/search?q=${q}&type=${type}&limit=${limit}`, this.accessToken)
  //       .pipe(
  //         flatMap(album => {
  //             const image = album['albums']['items'][0]['images'][0]['url'];
  //             const id = album['albums']['items'][0]['id'];
  //             this.albums.push({
  //               image: image,
  //               id: id,
  //             });
  //             return this._spotify.sendGet(`/albums/${id}/tracks`, this.accessToken);
  //         }),
  //       )
  //       .subscribe(tracksReturned => {
  //         tracksReturned['items'].forEach(element => {
  //           this.tracks.push('spotify:track:' + element['id']);
  //         });
  //       });
  //   });
  // }
}
