export const environment = {
  production: false,
  config: {
    spotifyURL: 'https://api.spotify.com/v1',
    scopes: 'user-read-private user-read-email',
    scope: 'playlist-modify-private playlist-read-private',
  }
};

export const backend = {
  production: false,
  config: {
    url: 'http://localhost:8888',
  }
};

