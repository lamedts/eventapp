
'use strict'
var qusetionSet = [
    {
        "qid": 0, 
        "question": "Overall, how would you rate the event??",
        "choices": [
            "Excellent",
            "Very good",
            "Fairly",
            "Mildly good",
            "Not good at all"
        ]
    },{
        "qid": 1, 
        "question": "Do you believe in IBM's Cognitive strategies and directions?",
        "choices": [
            "Very not believe",
            "Not believe",
            "Somewhat not believe",
            "Neutral",
            "Somewhat believe",
            "Believe",
            "Very believe"
        ],
    },{
        "qid": 2, 
        "question": "Which focused product do you find most interested after attending the event? (Can choose more than 1 answer)",
        "choices": [
                   [
            "OpenPower",
            "FlashSystem",
            "Spectrum Storage",
            "Bluemix",
            "Security",
            "Verse",
            "Watson Analytics",
            "API Economy",
            "Hybrid Cloud Transformation",
            "None"
        ]
        ]

    },{
        "qid": 3, 
        "qsid": 0,
        "question": "Post your comment, if any. (Optional)",
        "choices": [],
    }
];


var QA = [];
for (var i=0; i<qusetionSet.length; i++) {
    QA.push({id: qusetionSet[i].id, qa: ""});

}

exports.findAll = function (req, res, next) {
    var answered = "";
    //console.log( qusetionSet[1].question);
    for (var i=0; i<qusetionSet.length; i++) {
        qusetionSet[i].answered = QA[i].qa;
    }
    res.send(qusetionSet);
};

exports.findById = function (req, res, next) {
    var id = req.params.id;
    res.send(qusetionSet[id]);
};

exports.update = function (req, res, next) {
    //console.log(req.body);
    for (var i=0; i<QA.length; i++) {
        if( req.body.id == QA[i].id)
            QA[i].qa = req.body.answered;
    }
    console.log(QA);
    res.send(QA);
};

exports.findChoices = function (req, res, next) {
    var id = req.params.id;
    res.send(qusetionSet[id]);
};

//var cloudant_url = "https://1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix:84b879e3802d7072715c36eb4209a6feae0c14e4b98e362c2e0f920c199f7b1b@1e68e1b3-c986-4ad5-b1a5-be3b44bed133-bluemix.cloudant.com"
var testDB = 'ans'
var realDB = 'summit'
var cloudant_db = 'survey'

console.log(global.nosql)

exports.submit = function(req, res, next){
    console.log('submit')
    //var url = cloudant_url
    var nano = require('nano')(global.nosql);
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
