
var cloudant_url = "https://1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix:84b879e3802d7072715c36eb4209a6feae0c14e4b98e362c2e0f920c199f7b1b@1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix.cloudant.com"
var testDB = 'summit_raw'
var realDB = 'summit'
var cloudant_db = testDB

exports.submit = function(req, res){
    console.log('submit')
    var url = cloudant_url
    var nano = require('nano')(url);
    var ndb = nano.db.use(cloudant_db);
    //ndb.insert({ crazy: true }, 'rabbit', function(err, body, header) {
    ndb.insert(req.body, function(err, body, header) {
        var status = "...";
        if (err) {
            console.log('[ndb.insert] ', err.message);
            status = "Problem occur"
        }else{
            console.log('you have inserted the rabbit.')
            console.log(body);
            status = "SUBMITTED"
        }
        setTimeout(function(){ 
            res.send({type: status, disable:"true"});
        }, 3000);
    });
};