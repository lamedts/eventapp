
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
