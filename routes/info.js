var cloudant_db = 'golf'
var cloudant_user = 'record'

var nano = require('nano')(global.nosql);
var ndb = nano.db.use(cloudant_db);
var udb = nano.db.use(cloudant_user);
console.log(global.nosql);

exports.getYardInfo = function(req, res, next)
{
	 var vid = req.params.vid;
	 ndb.get(vid, function(err, body)
	 {
		if (err) 
		{
			console.log('err0');
			console.log(err);
			res.send('Not Found');
		}
		else
		{	
			console.log("test");
			console.log(body);
			//if (input == body.name)
			//{
				res.send(body);
				//res.render('web2', body);
			//}
		}
	});		
    
    
 }
 
exports.getYards =  function(req, res, next)
{
	ndb.list({include_docs: true}, function(err,body)
	{
		 if (err)
		 {
			 console.log(err);
			 res.render('Not found');
		 }
		else
		{
			console.log(body);
			//console.log(body.total_rows);
			res.send(body.rows);
		}
	 });
	 
}

exports.createYard = function (req,res,next)
{
	var str;
	var pad = "000";
	var ans; 
	ndb.list({include_docs: true},function(err,body)
	{
		
		str = "" + (body.total_rows +1);
		
		callback();
	});
	function callback(){
		ans = pad.substring(0, pad.length - str.length) + str;
		ndb.insert({_id: "vid"+ans, name:req.body.name, vid:str, Par:req.body.Par, SI:req.body.SI, address:req.body.address, QR_Code: req.body.QR_Code }, 
			function(err, body)
			{
				console.log("test");
				if (err)
				{
					console.log(err);
					res.send('Cannot insert');
				}
				else
				{
					console.log(body);
					res.send(body);
				}
			});
	}
}

exports.getUserInfo = function(req, res, next)
{
	 var uid = req.params.uid;
	 
	 
	 udb.get(uid, function(err, body)
	 {
		//console.log("test");
		if (err) 
		{
			console.log('err0');
			console.log(err);
			res.send('Not Found');
		}
		else
		{	console.log(body);
			
				//console.log(body.uid);
				//console.log(body.upud);
				//console.log(body.uPar);
				//console.log(body.vid);
				res.send(body);
			
		}
	});		
 }
 
 exports.getUser =  function(req, res, next)
{
	udb.list({include_docs: true}, function(err,body)
	{
		 if (err)
		 {
			 console.log(err);
			 res.send('Not founcd');
		 }
		else
		{
			console.log(body);
			res.send(body);
		}
	 });
}





exports.updateYard = function (req,res,next)
{
	var id = req.body._id;
	ndb.get(id, function(err, body)
	{
		if (err) 
		{
			console.log('err0');
			console.log(err);
			res.send('Not Found');
		}
		else
		{	
			console.log(body);
			ndb.insert({_id: body._id, _rev: body._rev, name: req.body.name, vid: body.vid, Par: req.body.Par, SI: req.body.SI, address: req.body.address, QR_Code: req.body.QR_Code }, 
				function(err2, body2)
				{
					if(err2){
						console.log(err2);
					}else{
						console.log(body2);
						res.send(body2);
					}
				});
		}
	});
}
	
	


exports.createUser = function (req,res,next)
{
	var str;// = "" + 1;
	var pad = "000";
	var ans; //= pad.substring(0, pad.length - str.length) + str;
	udb.list({include_docs: true},function(err,body)
	{
		
		str = "" + (body.total_rows +1);
		
		callback();
	});
	function callback(){
		ans = pad.substring(0, pad.length - str.length) + str;
		udb.insert({_id: "vid"+ans, uid:req.body.uid, upud:req.body.upud, upar:req.body.upar, vid:req.body.vid}, 
			function(err, body)
			{
				console.log("test");
				if (err)
				{
					console.log(err);
					res.send('Cannot insert');
				}
				else
				{
					console.log(body);
					res.send(body);
				}
			});
	}
}

