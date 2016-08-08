var cloudant_db = 'receipt';
var nano = require('nano')(global.nosql);
var ndb = nano.db.use(cloudant_db);
console.log(global.nosql);

exports.check_claim = function(req, res){
	var id = req.body._id;
	console.log("Request to claim receipt of id: "+id);
	ndb.head(id, function(err, body, header){
		if ( header ){
			console.log(header);
			console.log("Receipt already exists");
			claim();
		}
		else if ( err ){
			console.log(err);
			if (parseFloat(req.body.claim_amount)>parseFloat(req.body.amount)){
				console.log("Claim amoount exceeds receipt amount");
				res.send("Claim fails");
			}else{
				console.log("Receipt not found, create a new one");
				create();
			}
		}
	});

	var create = function(){
		var company = req.body.company;
		company = company.replace(" ","_");
		company = company.toLowerCase();

		var hkid = req.body.hkid.toLowerCase();

		var claimed = [{company: company, claimed_amount: parseFloat(req.body.claim_amount)}];

		ndb.insert({_id: id, amount: parseFloat(req.body.amount), claimed: claimed, name: req.body.name, hkid: hkid}, 
			function(err, body)
			{
				if (err)
				{
					console.log(err);
					res.send('Error');
				}
				else
				{
					console.log(body);
					res.send("Claim succeeds");
				}
			});
	}

	var claim = function(){
		ndb.get(id, function(err, body){
			if (err) 
			{
				console.log(err);
				res.send('Not found');
			}else{
				console.log(body);
				var claimed = body.claimed.slice();
				var claimed_sum = 0;
				for (var i=0; i<claimed.length; i++){
					claimed_sum += parseFloat(claimed[i].claimed_amount);
				}
				claimed_sum += parseFloat(req.body.claim_amount);
				console.log("Claimed_sum:"+claimed_sum);
				if (claimed_sum > parseFloat(req.body.amount)){
					res.send("Claim fails");
				}else{
					var company = req.body.company;
					company = company.replace(" ","_");
					company = company.toLowerCase();

					var hkid = req.body.hkid.toLowerCase();

					claimed = [];
					claimed = body.claimed;
					console.log(claimed[0]);
					var c = {company: company, claimed_amount: parseFloat(req.body.claim_amount)};
					console.log(c);
					claimed.push(c);
					console.log(claimed);
					ndb.insert({_id: id, _rev: body._rev, amount: parseFloat(req.body.amount), claimed: claimed, name: req.body.name, hkid: hkid}, function(err2, body2){
						if (err2){
							console.log(err2);
							res.send("Error");
						}else{
							console.log(body2);
							res.send("Claim succeeds");
						}
					});
				}
			}
		});
	}
}
