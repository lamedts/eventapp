/*eslint-env node */

var cloudant_url = "https://1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix:84b879e3802d7072715c36eb4209a6feae0c14e4b98e362c2e0f920c199f7b1b@1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix.cloudant.com";;
var cloudant_db = 'eventapp';
var nano = require('nano')(cloudant_url);
var ndb = nano.db.use(cloudant_db);
var combine = {};

var setList = function( callback){
  global.list = [];
  ndb.view('ppl', 'record',{ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        global.list.push(
            {
              "name": doc.doc.fname + ' ' + doc.doc.lname,
              "from": doc.doc.from,
              "list": 'Yes',
              "submit": doc.doc.submit,
              "attend": "--"
            }
        );
      });
    }
    callback && callback();
  });
};

var setData = function( callback){
  ndb.view('ppl', 'Ans',{ include_docs: true }, function(err, body) {
    if (!err) {
      combine = {};
      for (var key in body.rows[0].doc.ans){
          combine[key] = []
      }
      var chkbox;
      body.rows.forEach(function(doc) {
        for( var key in doc.doc.ans){
            if(!Array.isArray(doc.doc.ans[key])){
                combine[key].push(doc.doc.ans[key])
            }else{
                for(var i = 0; i < doc.doc.ans[key].length; i++){
                    combine[key].push(doc.doc.ans[key][i])
                    chkbox = key
                }
            }
        }
      });
      //console.log(combine)
      for (var key in combine){
          var  count = {}; 
          combine[key].forEach(function(i) { count[i] = (count[i]||0)+1;  });
          if(chkbox == key){
            combine[key] = []
            combine[key].push(count)
          }else{
            combine[key] = count
          }
      }
      //console.log(combine)
    }
    callback && callback();
  });
};

exports.index = function (req, res, next) {

    res.render('index', { title: 'IBM', qq: combine });
};

exports.getInfo = function (req, res, next) {

    res.send({list: global.list, ans:combine});
};

exports.set = function (req, res, next) {
	console.log('call setlist');
  res.send(setList());
};

exports.append = function (req, res, next) {
  global.list.push(
      {
        "name": req.body.name,
        "company": req.body.company,
        "seat": 'No',
        "list": false,
        "submit": false,
        "attend": true
      }
  );
};

exports.test = function(req, res){

  setData();
};

exports.ctrl = function (req, res, next) {

    res.render('ctrl', { title: 'IBM', qq: combine });
};

setList(function(){console.log('reset');});
setData(function(){console.log('setData()');});