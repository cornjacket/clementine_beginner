'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');

var app = express();


mongoose.connect('mongodb://localhost:27017/clementinejs');
/*mongo.connect('mongodb://localhost:27017/clementinejs', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }
*/
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

    routes(app) //, db);

    var port = 8080
    app.listen(port, function () {
        console.log('Listening on port '+port+'...');
    });

//});