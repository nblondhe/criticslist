
const express = require('express');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio')

// Adjust to choose randomly selected User-Agent
var options = {
    url: 'https://www.metacritic.com/music',
    headers: {
      'User-Agent': ' AppleWebKit/537.36 (KHTML, like Gecko) '
    }
  };

const reviews = [];
// request(options, (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);

//     $('.basic_stat').each((i, el) => {
//       const tag = $(el).find('h3').text();
//       if (tag.length < 1) {
//         return true;
//       }
//       console.log('review', tag);
//       review = tag.split('-');
//       const reviewArtist = review[1];
//       const reviewAlbum = review[0];
//       reviews.push({ artist: reviewArtist, album: reviewAlbum })
//     })
//     const data = JSON.stringify(reviews)

//   }
// });

router.get('/metacritic-album-data', function(req, res) {
    res.status(200).send(reviews);
  });

  module.exports = router;