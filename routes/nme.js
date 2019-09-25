
const express = require('express');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio')
const utf8 = require('utf8');

// Adjust to choose randomly selected User-Agent
var options = {
    url: 'https://www.nme.com/reviews/album',
    headers: {
      'User-Agent': ' AppleWebKit/537.36 (KHTML, like Gecko) '
    }
  };

const reviews = {};
request(options, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.entry-content').each((i, el) => {
            const article = $(el).find('span').text();
            pre = article.split(/[ -]+/);
            let artist = [];
            let album = [];
            let artistFound = false;
            pre.forEach(element => {
                if (element.charCodeAt(0) !== 8211) {
                    if (artistFound !== true) {
                        artist.push(element);
                    } else {
                        if (element !== 'review') {
                            if (element.charCodeAt(0) === 8216) {
                                element = element.substring(1, element.length);
                            }
                            album.push(element);
                        }
                    }
                } else {
                    artistFound = true;
                }
            });
            const reviewArtist = artist.join(' ');
            let reviewAlbum = album.join(" ");
            reviewAlbum = reviewAlbum.substring(0, reviewAlbum.length-1);
            reviews[reviewArtist] = reviewAlbum;
        })

        const data = JSON.stringify(reviews)

    }
});

router.get('/nme-album-data', function(req, res) {
    res.status(200).send(reviews);
  });

  module.exports = router;