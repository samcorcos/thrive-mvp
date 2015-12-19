'use strict';

var express = require('express');
var posts = require('./mock/posts.json');

var postsLists = Object.keys(posts).map(function(value) {return posts[value]})

var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates')

app.get('/', function(req, res) {
	var path = req.path;
	res.locals.path = path;
	// same as saying res.render('index', {path: path})
  res.render('index');
});

app.get('/blog/:title?', function(req, res) {
  var title = req.params.title;
  if (title === null) {
    res.status(503);
    res.render('blog', {posts: postsLists});
  } else {
    var post = posts[title] || {};
    res.render('post', { post: post} );  
  }
});

app.get('/posts', function(req, res) {
	if (req.query.raw) {
		res.json(posts);
	} else {
	res.json(postsLists);
	}
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



app.listen(3000, function() {
  console.log("The frontend server is running on port 3000!");
});