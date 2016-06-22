
var cloudant_db = 'indiv'

console.log(global.nosql)

exports.getUserInfo = function(req, res, next){
    var uid = req.params.uid;
    var nano = require('nano')(global.nosql);
    var ndb = nano.db.use(cloudant_db);
    uid = 'uid' + uid
    ndb.get(uid, function(err, body) {
        if (err) res.send('Not Found')
        else res.send(body)
    });
};

exports.getUserList = function(req, res, next){
    var nano = require('nano')(global.nosql);
    var ndb = nano.db.use('drawlist');
    ndb.list({include_docs: true}, function(err, doc) {
    	console.log(doc.doc)
    	doc_ary = []
        if (err) {
        	res.send('Not Found')
        }else{
			doc.rows.forEach(function(doc) {
				doc_ary.push({
	        		id: doc.doc._id, 
	        		name: doc.doc.name,
	        		room: doc.doc.room, 
	        		table: doc.doc.table
	        	})
        	});
        	
        	res.send(doc_ary)
        } 
    });
};
