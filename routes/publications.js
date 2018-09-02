
const express = require('express');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio')

var options = {
    url: 'https://pitchfork.com/best/high-scoring-albums/',
    headers: {
      'User-Agent': ' AppleWebKit/537.36 (KHTML, like Gecko) '
    }
  };

const reviews = [];
request(options, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.review__title').each((i, el) => {           
            const reviewArtist = $(el).find('li').text();
            const reviewAlbum = $(el).find('h2').text();
            reviews.push({artist: reviewArtist, album: reviewAlbum})
        })

        console.log('reviews', reviews);
        const data = JSON.stringify(reviews)

    }
});

router.get('/album-data', function(req, res) {
    res.status(200).send(reviews);
  });

  module.exports = router;