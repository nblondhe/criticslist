const express = require('express')
const path = require('path')
const request = require('request')
const querystring = require('querystring')
const bodyParser = require('body-parser');

const metacriticRouter = require('./routes/metacritic');
const pitchforkRouter = require('./routes/pitchfork');
const nmeRouter = require('./routes/nme');
const guardianRouter = require('./routes/guardian');
const authRouter = require('./routes/auth');
const app = express()

const port = process.env.PORT || 8888

if (process.env.PRODUCTION !== 'true') {
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
}

if (process.env.PRODUCTION === 'true') {
  app.use(express.static(__dirname + '/dist/criticslist'));
}
app.use(bodyParser.json());

// app.use('/metacritic', metacriticRouter);
app.use('/guardian', guardianRouter);
app.use('/nme', nmeRouter);
app.use('/pitchfork', pitchforkRouter);
app.use('/auth', authRouter);

app.listen(port)
console.log(`Listening on port ${port}`)

if (process.env.PRODUCTION === 'true') {
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/criticslist/index.html'));
  })
}