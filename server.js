const express = require('express')
const path = require('path')
const request = require('request')
const querystring = require('querystring')
const bodyParser = require('body-parser');

const publicationsRouter = require('./routes/publications');
const authRouter = require('./routes/auth');
const app = express()

const port = process.env.PORT || 8888

app.use(express.static(__dirname + '/dist/criticslist'));
app.use(bodyParser.json());

app.use('/publications', publicationsRouter);
app.use('/auth', authRouter);

app.listen(port)
console.log(`Listening on port ${port}`)

// Angular routing for production (PathLocationStrategy)
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +'/dist/criticslist/index.html'));
})