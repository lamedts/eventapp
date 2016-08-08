var cloudant_user = 'record';
var input;
var nano = require('nano')(global.nosql);
var udb = nano.db.use(cloudant_user);
console.log(global.nosql);


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
            {   console.log(body);

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

exports.createUser = function (req,res,next)
{
    console.log("request to create user "+req.body.uid);
    udb.head(req.body.uid, function(err, body, header){
        if ( header ){
            console.log(header);
            console.log("User already exists");
            res.send('User exits');
        }
        else if ( err ){
            console.log(err);
            console.log("User not found, create a new one");
            create();
        }
    });

    var create = function(){
        var id = req.body.uid.replace(" ","_");
        udb.insert({_id: id, name: req.body.name, uputt:req.body.uputt, upar:req.body.upar}, 
            function(err, body)
            {
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

exports.updateUser = function(req, res, next){
    var id = req.body.uid;
    id = id.replace(" ","_");
    udb.get(id, function(err, body)
    {
        if (err) 
        {
            console.log('err0');
            console.log(err);
            res.send('Not Found');
        }
        else
        {   
            console.log("original record: ");
            console.log(body);
            udb.insert({_id: body._id, _rev: body._rev, name: req.body.name, uputt:req.body.uputt, upar:req.body.upar}, 
                function(err2, body2)
                {
                    if(err2){
                        console.log(err2);
                        res.send("err");
                    }else{
                        console.log(body2);
                        res.send(body2);
                    }
                });
        }
    });
}
