const express = require('express');
const router = express.Router();
const querystring = require('querystring')
const request = require('request')

const port = process.env.PORT || 8888
const redirect_uri = process.env.BACK_URL + '/auth/callback'
var access_token;

router.get('/login', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email playlist-read-private playlist-modify-private',
      redirect_uri
    }))
})

router.get('/callback', function (req, res) {
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
  request.post(authOptions, function (error, response, body) {
    access_token = body.access_token
    let uri = process.env.FRONT_URL + '/playlist'
    res.redirect(uri)
  })
})

router.get('/get-token', function (req, res) {
  res.status(200).send({token: access_token});
})

  module.exports = router;