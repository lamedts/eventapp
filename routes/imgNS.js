
var cloudant_db = 'img'
var nano = require('nano')(global.nosql);
var ndb = nano.db.use(cloudant_db);
console.log(global.nosql)
var moment = require('moment');
var fs = require('fs');
var stream = require('stream');

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
//https://tonyspiro.com/uploading-and-resizing-an-image-using-node-js/
exports.getImg = function(req, res, next){
  
  if(req.params.iid){
    	var iid = req.params.iid;
      // alice.attachment.get('rabbit', 'rabbit.png', function(err, body) {
      // alice.get('rabbit', { revs_info: true }, function(err, body) {
	    ndb.multipart.get( iid, function(err, body) {
	        if (err){ 
            res.send(err)
	        }else{ 
            var img = new Buffer(body._attachments.img.data.toString(), 'base64');
            res.writeHead(200, {
              'Content-Type': body._attachments.img.content_type,
              //'Content-Length': body._attachments.img.data.length
            });
            res.end(img); 
            //res.send(body._attachments.img.content_type)
          }
	    });
	}else{
		ndb.list({include_docs: true}, function(err, body) {
			doc_ary = []

			if (!err) {
				body.rows.forEach(function(doc) {
					doc_ary.push({id: doc.doc._id, user: doc.doc.user,time: doc.doc.time, url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + doc.id, like: doc.doc.like, comment: doc.doc.comment})
				  global.img_like[doc.doc._id] = doc.doc.like
          global.img_comment[doc.doc._id] = doc.doc._id
        });
			}
      //console.log()
      global.imgList = doc_ary.sort(dynamicSort("-time"))
			res.send(global.imgList);
		});
	}
};

exports.postImg = function(req, res, next){
  console.log(req.body, req.files); // check console 
  var newName = moment().format('DD_MM_YYYY_HHmmss') + '-' + req.body.user.toLowerCase().replace(/ /g,"_")  
  fs.readFile(req.files.image.path, function (err, data) {
      if (!err) {
        ndb.multipart.insert(
          { name: newName, time: moment().format('DD_MM_YYYY_HHmm'), user: req.body.user, like: 0,comment: [] }, 
          [{name: 'img', data: data, content_type: req.files.image.type}], 
          newName, 
        function(err, body) {
          if (err){
            console.log(err)
            return
          }
          console.log(body);
          res.send('Success, org')
          console.log('fhj')

        });
      }else{
        console.log('[error] - read err')
        res.send('[error] - read err')
      }

  });
};
