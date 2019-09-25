
const express = require('express');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio')

// Adjust to choose randomly selected User-Agent
var options = {
    url: 'https://www.theguardian.com/music+tone/albumreview',
    headers: {
      'User-Agent': ' AppleWebKit/537.36 (KHTML, like Gecko) '
    }
  };

const reviews = {};
request(options, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    let review;

    $('.u-faux-block-link__cta').each((i, el) => {
      const tag = $(el).find('span').text();
      try {
        review = tag.split(':');
      } catch(e) {
        // Log: document pattern changed
      }

      if(review && review.length > 1) {
        const reviewArtist = review[0];
        const reviewAlbum = review[1].split('review')[0].replace(/[?-]/g, "");
        reviews[reviewArtist] = reviewAlbum;
      }
    })
    const data = JSON.stringify(reviews)
  }
});

router.get('/guardian-album-data', function(req, res) {
    res.status(200).send(reviews);
  });

  module.exports = router;