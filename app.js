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

var app     = require('express')(),
	server 	= require('http').Server(app);

var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 3000;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

var dburl = "https://259893d7-709a-4f18-a352-05919f0d5867-bluemix:43dbcf177121f10f346a79878e0a2ef6ece50d17cfd3b162abcc262e8895d0c7@259893d7-709a-4f18-a352-05919f0d5867-bluemix.cloudant.com";

var str_service = JSON.stringify(services);
//str_service = '{}'
if(str_service === '{}'){
	global.nosql = dburl;
	global.nosql_host = "259893d7-709a-4f18-a352-05919f0d5867-bluemix.cloudant.com";
}else{
	global.nosql = services.cloudantNoSQLDB[0].credentials.url;
	global.nosql_host = services.cloudantNoSQLDB[0].credentials.host;
}

//*******************************
//			routing
//*******************************

// var login = require('./routes/login');
var dataBase = require('./routes/dataBase');
var web = require('./routes/web');


//*******************************
//			set app
//*******************************
//	Cross-Origin Resource Sharing
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
//*******************************
//			web
//*******************************
//	client use
//app.use(express.static('_internal/public'));
app.set('views', path.join(__dirname, '/_internal/view'));
app.set('view engine', 'jade');
//	internal use
// app.use(express.static('_client'));
app.use(express.static('_internal/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

//*******************************
//			routing
//*******************************
app.get('/', function(req, res){
	var company = req.query.company;
	if (company != null)
		res.render('login_page', {"company": company});
	else
		res.send("No company name specified");
});

app.get('/claim', web.claim);
app.post('/check_claim', dataBase.check_claim)

//*******************************
//			start app
//*******************************
app.set('port', port);
server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
