'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var config = require('./config');
var Peasant = require('./lib/model/peasant');

var app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoPath = config.db[process.env.NODE_ENV || 'dev'];
mongoose.connect(mongoPath, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('connected to ' + mongoPath);
  }
});

var port = config.port[process.env.NODE_ENV || 'dev'];

var router = express.Router();

router.use((req, res, next) => {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(req.method + ' ' + url);
  next();
});

router.route('/peasant')
  .post((req, res) => {
    var peasant = new Peasant();
    peasant.name = req.body.name;
    peasant.year = req.body.year;
    peasant.save(err => {
      if (err) {
        res.send(err);
      }
      res.json(peasant);
    });
  })
  .get((req, res) => {
    Peasant.find((err, peasants) => {
      if (err) {
        res.send(err);
      }
      res.json(peasants);
    });
  });

router.route('/peasant/:id')
  .get((req, res) => {
    Peasant.findById(req.params.id, (err, peasant) => {
      if (err) {
        res.send(err);
      }
      res.json(peasant);
    });
  })
  .put((req, res) => {
    Peasant.findById(req.params.id, (err, peasant) => {
      if (err) {
        res.send(err);
      }
      peasant.name = req.body.name;
      peasant.year = req.body.year;
      peasant.save((err) => {
        if (err) {
          res.send(err);
        }
        res.json(peasant);
      });
    });
  })
  .delete((req, res) => {
    Peasant.remove({
      _id: req.params.id
    }, (err) => {
      if (err) {
        res.send(err);
      }
      res.json({});
    });
  });

router.use((req, res, next) => {
  res.status(404).json({message: 'not found', status: 404});
});

app.use('/api', router);

app.use((req, res, next) => {
  res.sendfile('index.html', {root: './static'});
});

app.listen(port);
var url = 'http://localhost:' + port;
console.log('running on ' + url);
exports.url = url + '/api/';
