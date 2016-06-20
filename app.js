/*eslint-env node */
/*globals bodyParser */
'use strict'
//*******************************
//			set varible
//*******************************
var express 	= require('express'),
	request 	= require('request'),
	path 		= require('path'),
	bodyParser 	= require('body-parser'),
	multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty();
var watson = require('watson-developer-cloud');
var personality_insights = watson.personality_insights({
		username: 'cb88c454-9fba-4d04-b18c-cf44b0bc5309',
  		password: 'LT8wh1H68HDC',
  		version: 'v2'
	});
var app 	= require('express')(),
	server 	= require('http').Server(app),
	io 		= require('socket.io')(server);
var auth 	= require('http-auth'),
	basic 	= auth.basic({
		realm: "Internal Use.",
		}, function (username, password, callback) { 
			// Custom authentication method. 
			callback(username === "IBM" && password === "summit");
		}
	);
var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 3000;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
//// ~/dashboard.html
// imgMgt-cloudantNoSQLDB
var testdb = "https://117ee633-dffc-42ec-8129-c278db864778-bluemix:a32b17c556a29d3b990d99600e68766736d39728d95a67dfa2b0a7146b5656c5@117ee633-dffc-42ec-8129-c278db864778-bluemix.cloudant.com";
// Cloudant NoSQL - eventapp
//var realdb = "https://faffb586-e17e-4d67-979b-7cb55ff54819-bluemix:990dd1d043a34329e1dca54ddcc65b2eb2cf076ce028d0788536c00d396c0a7f@faffb586-e17e-4d67-979b-7cb55ff54819-bluemix.cloudant.com"
var dburl = testdb
var str_service = JSON.stringify(services)
str_service = '{}'
if(str_service === '{}'){
	global.nosql = dburl;
	global.nosql_host = '117ee633-dffc-42ec-8129-c278db864778-bluemix.cloudant.com'
}else{
	global.nosql = services.cloudantNoSQLDB[0].credentials.url 
	global.nosql_host = services.cloudantNoSQLDB[0].credentials.host 
}
global.imgJson 	= [];
global.list 	= [];
global.img_like = {}
global.img_comment = {}

var qSet 		= require('./routes/qSet'),
	//imgPhp 	= require('./routes/imgPhp'),
	usersInfo 	= require('./routes/user'),
	imgInfo 	= require('./routes/imgNS'),
	panel 		= require('./routes/panel');

//*******************************
//			set app
//*******************************
//	Cross-Origin Resource Sharing
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
//	client use
//app.use(express.static('_internal/public'));
//app.set('views', path.join(__dirname, '/_internal/view'));
//app.set('view engine', 'jade');
//	internal use
app.use(express.static('_client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//*******************************
//			routing
//*******************************
app.put('/qSet/submit', qSet.submit);
app.get('/qSet/:id', qSet.findById);
app.put('/qSet/:id', qSet.update);
app.get('/qSet/:id/choices', qSet.findChoices);
app.get('/qSet', qSet.findAll);

//app.get('/api/set', imgPhp.set);
//app.get('/api/get', imgPhp.get);
//app.get('/api/reset', imgPhp.reset);



app.get('/api/users/:uid', usersInfo.getUserInfo)
app.get('/api/img', imgInfo.getImg)
app.get('/api/img/:iid', imgInfo.getImg)
app.post('/api/img/post', multipartyMiddleware, imgInfo.postImg)
app.post('/api/pi', function(req, res){
	console.log(req.body);
	//res.send({sned: req.body});
	personality_insights.profile({text: req.body.text}, function(error, response) {
		if (error) res.send('error:', error);
		else res.send(JSON.stringify(response, null, 2));
	});
})
app.get('/test/api', function(req, res){

var nano = require('nano')(global.nosql);
var cloudant_db = 'img'
var ndb = nano.db.use(cloudant_db);

/*
ndb.get('20_06_2016_130050-e', function(error, body){
	console.log(body)
	ndb.insert({ _id: '20_06_2016_130050-e', _rev: body._rev, crazy: false }, function(err, body) {
	  if (!err)
	    console.log(body)
	})
})
*/
console.log(global.img_like)

})

//app.use('/panel', auth.connect(basic));
app.get('/panel', panel.index);
app.get('/panel/ctrl', panel.ctrl);
app.get('/panel/get', panel.getInfo);
app.get('/panel/test', panel.test);
//app.get('/panel/init', panel.set);
//app.get('/panel/reset', panel.reset);
app.put('/listput', function(req, res, next){
	console.log(req.body)
    for (var i = 0; i < global.list.length; i++) {
    if(global.list[i].company == req.body.Com){
      if(req.body.First + ' ' + req.body.Last == global.list[i].name){
        console.log('found')
        global.list[i].attend = "Attend"
        break;
      }
    }
  }
});

//*******************************
//			start app
//*******************************
app.set('port', port);
server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

//*******************************
//			socket.io
//*******************************

io.on('connection', function (socket) {
  	socket.on('tUP', function (data) {
  		//console.log('tup')
  		//console.log(global.img_like)
  		console.log(data)
  		global.img_like[data.iid]++
  		//console.log(global.img_like)
  		socket.emit('new', { newSet: global.img_like });
  		//console.log(global.img_like)
  		/*
	    for (var i = global.imgJson.length - 1; i >= 0; i--) {
	    	if(global.imgJson[i].id === data.likeIdx)
	    		global.imgJson[i].like++;
	    	
	    }
	    console.log(global.imgJson);
	    
		var url = "https://ivm.swel.tk/test.php"
		request({
		    url: url,
		    method: "POST",
		    json: true,
    		body: global.imgJson
		}, function (error, response, body) {
			console.log(response)
			console.log(body)
		})


	    socket.emit('new', { newSet: global.imgJson });
	    */
  	});
  	socket.on('postCmt', function (data) {
	    for (var i = global.imgJson.length - 1; i >= 0; i--) {
	    	if(global.imgJson[i].id === data.imgIdx)
	    		global.imgJson[i].comment.push(data.cmt);
	    	//console.log(global.imgJson);
	    }
	    //console.log(global.imgJson);

		var url = "https://ivm.swel.tk/test.php"
		request({
		    url: url,
		    method: "POST",
		    json: true,
    		body: global.imgJson
		}, function (error, response, body) {
			console.log(response)
			console.log(body)
		})

	    socket.emit('new', { newSet: global.imgJson });
	    
  	});
});
