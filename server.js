const express = require('express')
const path = require('path')
const request = require('request')
const querystring = require('querystring')
const bodyParser = require('body-parser');

const publicationsRouter = require('./routes/publications');
const authRouter = require('./routes/auth');
const app = express()

const port = process.env.PORT || 8888
app.use(bodyParser.json());

if (process.env.DEVELOPMENT) {
  // CORS for local dev 
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
} else {
  app.use(express.static(__dirname + '/dist/criticslist'));
  // // Angular routing for production (PathLocationStrategy)
  app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname +'/dist/criticslist/index.html'));
  })
}

app.use('/publications', publicationsRouter);
app.use('/auth', authRouter);

app.listen(port)
console.log(`Listening on port ${port}`)
