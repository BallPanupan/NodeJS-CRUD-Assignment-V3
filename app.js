'use strict'

var express = require('express');
var cors = require('cors')
var path = require('path')
var bodyParser = require('body-parser');
var Mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var multer = require('multer');
var app = express();

app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
//
app.set('view engine', 'ejs');

//
Mongoose.Promise = global.Promise

var routes = require('./app/routes/router')

const NODE_ENV = process.env.NODE_ENV || 'developement'

//const app = express()


// CONFIG
app.use(cors())
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))

// Mongoose
const database = (NODE_ENV !== 'test') ? 'pkap_todolists': 'pkap_test'
const mongodbHost = process.env.MONGODB_URL || `127.0.0.1:27017/${database}`

//Mongo connect database
Mongoose.connect(`mongodb://${mongodbHost}`, {useMongoClient: true})


// Routes
  //app.use('/api', routes)
  app.use(require = routes)
//get

// RUN SERVER
const port = 3000
const callback = () => console.log(`SERVER IS RUNNING AT PORT ${port}.`)
app.listen(port, callback)





module.exports = app
