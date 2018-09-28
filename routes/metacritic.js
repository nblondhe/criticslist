
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
request(options, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $('.product_title').each((i, el) => {
      const albumTag = $(el).find('a').text();
      const artistTag = $(el).find('span').text();      
      console.log('albumtag ', albumTag);
      console.log('artisttag ', artistTag);
      // const reviewArtist = $(el).find('li').text();
      // const reviewAlbum = $(el).find('h2').text();
      // reviews.push({ artist: reviewArtist, album: reviewAlbum })
    })
    // $('.product_artist').each((i, el) => {
    //   console.log('produc artist', el);
    // })
    console.log('\nmetacritic reviews', reviews);
    const data = JSON.stringify(reviews)

  }
});

router.get('/metacritic-album-data', function(req, res) {
    res.status(200).send(reviews);
  });

  module.exports = router;