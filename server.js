const express = require('express')
const path = require('path')
const request = require('request')
// const cheerio = require('cheerio')
var publicationsRouter = require('./routes/publications');
const querystring = require('querystring')
const bodyParser = require('body-parser');
const app = express()

const port = process.env.PORT || 8888
const redirect_uri = 
process.env.REDIRECT_URI || 
// ** PRODUCTION **
// 'https://criticslist.herokuapp.com/callback'
// ** LOCAL DEV **
'http://127.0.0.1:8888/callback'


// CORS for local dev 

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
  // res.setHeader('Access-Control-Allow-Origin', port);
  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, content-type');
  
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());

// ** PRODUCTION **
app.use(express.static(__dirname + '/dist/criticslist'));
// ===============

// const options = {
//   url: "https://pitchfork.com/best/high-scoring-albums/",
//   headers: {
//     "User-Agent": " AppleWebKit/537.36 (KHTML, like Gecko) "
//   }
// };

// const reviews = [];
// var albumData;
// request(options, (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);
//     $(".review__title").each((i, el) => {
//       const reviewArtist = $(el)
//         .find("li")
//         .text();
//       const reviewAlbum = $(el)
//         .find("h2")
//         .text();
//       reviews.push({ artist: reviewArtist, album: reviewAlbum });
//     });
//     console.log("reviews", reviews);
//     albumData = JSON.stringify(reviews);
//   }
// });

// app.route('/album-data').get((req, res) => {
//   res.status(200).send(reviews);
// });

app.use('/publications', publicationsRouter);

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email playlist-read-private playlist-modify-private',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    // ** PRODUCTION **
    // let uri = process.env.FRONTEND_URI || 'https://criticslist.herokuapp.com/data'
    // ** LOCAL DEV **
    let uri = process.env.FRONTEND_URI || 'http://127.0.0.1:' + port + '/data'
    res.redirect(uri + '?access_token=' + access_token)
    console.log('frontend uri', process.env.FRONTEND_URI)
  })
})


console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)


// ** PRODUCTION **
// Angular routing for production (PathLocationStrategy)
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +'/dist/criticslist/index.html'));
})