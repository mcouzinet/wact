/**************
 * VAR GLOBAL *
 *************/
var gravity = 1;
/***********
 * MONGODB *
 **********/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var currentTime = new Date();
var Comments = new Schema({
    author    : String
  , body      : String
  , date      : Date
});

var articles = new Schema({
    title       : String,
    url         : String,
	date        : Number,
	author      : Number,
	catégorie   : String,
	like		: Number,
	score       : Number,
	source	    : String,
	comments    : [Comments]
});

function tri(tab, callback){
	var tabTri = new Array();
	var tabInt = new Array();
	for(var i=0;i<tab.length;i++){
		hour = secondsToTime(currentTime.getTime() - tab[i].date);
		tab[i].score = Number((tab[i].like) / (hour+2)^gravity);
		tab[i].aff = (tab[i].score<10)?'un':(tab[i].score<20)?'deux':(tab[i].score<30)?'trois':(tab[i].score<40)?'quatre':'cinq';
	}
	for(var i=0;i<tab.length;i++){
		for(var j=i+1;j<tab.length;j++){
			if(tab[i].score<tab[j].score){
				a = tab[i];
				tab[i]=tab[j];
				tab[j]=a;
			}
		}
	}
	callback(tab);
}

var Post = mongoose.model('articles', articles);
mongoose.connect('mongodb://92.243.19.190/wact');

/**
 * Module dependencies.
 */

var express = require('express')
  , _ = require('underscore')
  , path = require('path')
  , url = require('url');

var app = module.exports = express.createServer(),
     io = require('socket.io').listen(app);


/************************
 * Global configuration *
 ***********************/
	
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
  app.use(express.session({ secret: 'secretKey' }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/**********
 * ROUTES *
 *********/
app.get('/', function(req, res){
  res.render('index');
});
/**/

io.sockets.on('connection', function (socket) {
	sid = socket.id;
});

app.get('/Act/:titre', function(req, res){
  	Post.find({ title: req.params.titre }, function(err, urls) {
	   if(err || (urls == 0)){
			res.render('index');
	   }else{
			res.render('article', {
				url:urls[0].url
			});
		}
	});
});

app.get('/Populaire', function(req, res){	
	var tabLink = new Array;
	Post.find({}, function(err, links) {
	   	links.forEach(function(link){
				link.temps = ToTimeTotal(currentTime.getTime() - link.date);			
		     	tabLink.push(link);
			});
			tri(tabLink,function(tabTri){
					
					res.render('nouveau', {						
						links:tabTri
					});
			});
		}).sort({score:1}).limit(30);
});

app.get('/nouveau', function(req, res){	
	var tabLink = new Array;
	Post.find({}, function(err, links) {
	   	links.forEach(function(link){
		     link.temps = ToTimeTotal(currentTime.getTime() - link.date);
			 link.aff = (link.score<10)?'un':(link.score<20)?'deux':(link.score<30)?'trois':(link.score<40)?'quatre':'cinq';
		     tabLink.push(link);
			});
			res.render('nouveau', {
				links:tabLink
			});
		}).sort({date:-1}).limit(30);
});

app.post('/AddLink', function(req, res){
  	titre = req.param('titre');
	lien = req.param('lien');
	cat = req.param('choix');
	source = getDomain(lien);
	var link = new Post({ 
			title:titre,
			url: lien,
		  	date: currentTime.getTime(),
		  	author: 23,
			catégorie: cat,
		  	like: 1,
			score: 1,
		    source: source,
		  	comments: new Array()
	 });
	 link.save(function (err) { if (err) console.log('mongo: ', err); });
	io.sockets.emit('addLink',link);
	var tabLink = new Array;
	Post.find({}, function(err, links) {
	   	links.forEach(function(link){
				link.temps = ToTimeTotal(currentTime.getTime() - link.date);
		     	tabLink.push(link);
			});
			tri(tabLink,function(tabTri){
					res.render('nouveau', {
						links:tabTri
					});
			});
		}).sort({score:1}).limit(30);
});

app.get('/AddLink', function(req, res){
  	 res.render('addLink');
});


app.listen(3000);

/* TOOLS */
function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60 * 1000));
    return hours;
}
function ToTimeTotal(secs)
{
	var days = Math.floor(secs / (60 * 60 * 1000 *24));
    var hours = Math.floor(secs / (60 * 60 * 1000));
   
    var divisor_for_minutes = secs % (60 * 60 * 1000);
    var minutes = Math.floor(divisor_for_minutes / 60000);
 
    var divisor_for_seconds = divisor_for_minutes % 6000;
    var seconds = Math.ceil(divisor_for_seconds);
    var f,d;
	if(days>0){
		f='jours';
		d=days;
	}else{
 		if(hours > 0){ 
		f='heures';
		d=hours;
	}else{
		if(minutes > 0){
		 	f='minutes';
			d=minutes;
		}else{
			f='secondes';
			d=seconds;
		}}}
    var obj = {
        "d": d,
        "f": f
    };
    return obj;
}

function getDomain(url)
{
   return url.substring(7,url.indexOf("/",7));
}