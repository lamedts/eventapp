/*eslint-env node */
/*globals bodyParser */
'use strict'
//*******************************
//			set varible
//*******************************
var express 	= require('express'),
	request 	= require('request'),
	path 		= require('path'),
	bodyParser 	= require('body-parser');
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
var dburl = 'https://1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix:84b879e3802d7072715c36eb4209a6feae0c14e4b98e362c2e0f920c199f7b1b@1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix.cloudant.com';
if(JSON.stringify(services) === '{}')
	global.nosql = dburl;
else
	global.nosql = services.cloudantNoSQLDB[0].credentials.url 
global.imgJson 	= [];
global.list 	= [];
var qSet 	= require('./routes/qSet'),
	imgPhp 	= require('./routes/imgPhp'),
	panel 	= require('./routes/panel');

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
app.use(express.static('_internal/public'));
app.set('views', path.join(__dirname, '/_internal/view'));
app.set('view engine', 'jade');
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

app.get('/api/set', imgPhp.set);
app.get('/api/get', imgPhp.get);
app.get('/api/reset', imgPhp.reset);

//app.use('/panel', auth.connect(basic));
app.get('/panel', panel.index);
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
	    for (var i = global.imgJson.length - 1; i >= 0; i--) {
	    	if(global.imgJson[i].id === data.likeIdx)
	    		global.imgJson[i].like++;
	    	
	    }
	    console.log(global.imgJson);
	    /*
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
*/

	    socket.emit('new', { newSet: global.imgJson });
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
