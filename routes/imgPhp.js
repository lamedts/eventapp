
//lame
/*eslint-env node */
var cloudant_url = "https://1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix:84b879e3802d7072715c36eb4209a6feae0c14e4b98e362c2e0f920c199f7b1b@1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix.cloudant.com";
var testDB = 'summit_raw';
var realDB = 'summit';
var cloudant_db = testDB;
var request = require("request");

exports.set = function(req, res){
    console.log('imgPhp.set()')
    var url = "https://lvm.swel.tk/api/imgMgt/fileMgt.php";
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body) // Print the json response
            global.imgJson = body;
            //console.log(global.imgJson)
            res.send(body);
        }
    });
};

exports.get = function(req, res){
    res.send(global.imgJson);
};

exports.reset = function(req, res){
    var url = "https://lvm.swel.tk/api/imgMgt/reset.php";
    request({
        url: url,
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body); // Print the json response
        }
    });
};

