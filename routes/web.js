// var cloudant_db = 'golf';
// var nano = require('nano')(global.nosql);
// var ndb = nano.db.use(cloudant_db);
// console.log(global.nosql);

// exports.user = function(req, res, next){
// 	var vid = req.query.vid;
// 	console.log(vid);
// 	 ndb.get(vid, function(err, body)
// 	 {
// 		if (err) 
// 		{
// 			console.log('err0');
// 			console.log(err);
// 			res.send('Not Found');
// 		}
// 		else
// 		{	console.log(body);
// 			res.render('user', body);
// 		}
// 	});	
// }

exports.loginPage = function(req, res){
	res.render('loginPage');
}

exports.claim = function(req, res){
	var name = req.query.name;
	var company = req.query.company;
	console.log(company);
	// console.log(hkid);
	res.render("claim_page", {"name": name, "company": company});
}