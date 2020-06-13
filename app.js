var sf = require('node-salesforce');
const express = require('express')
const app = express()
const port = '3000';
const bodyParser = require("body-parser");

console.log('aaaaaaaaaaaaaa');

const fs = require('fs');


var fileOnServer = 'C:\\Users\\USER\\Desktop\\node_to_sf\\Dec2019Payslip.pdf',
    fileName = 'MyRandomImage.pdf',
    fileType = 'pdf';



app.use(bodyParser.json());

var conn = new sf.Connection({
   loginUrl : 'https://login.salesforce.com'
});



app.get('/', (req, res) => res.send('Hello World!'))

app.get('/mergerDocuments', function (req, res) {

    /*//curl https://mylighning-dev-ed.my.salesforce.com/services/data/v20.0/sobjects/Attachment/001D000000INjVe/body -H "Authorization: Bearer token"
    conn.apex.get("/customrest/", function(res) {
        console.log('res');
        console.log(res);
        // the response object structure depends on the definition of apex class
    });*/
    var allAttIds = req.body.data;
    console.log(req.body);
    var notesIds =['00P2x000002oDk6','00P2x000002oDk6'];
    var records =[];
    conn.query("SELECT Id, Name,Body FROM Attachment where id = '" + notesIds[0] + "'" )
  .on("record", function(record) {
    console.log(record);
    console.log(record.Body.toString());
    records.push(record);
  })
  .on("end", function(query) {
    console.log("total in database : " + query.totalSize);
    console.log("total fetched : " + query.totalFetched);
    res.send({status:200,records:records});
  })
  .on("error", function(err) {
    console.error(err);
  })
  .run({ autoFetch : true, maxFetch : 4000 });
    //res.send(JSON.stringify(records));
    res.send({status:2000,records:records});
});
//login Method
function login(username,pwd){
    conn.login(username, pwd, function(err, userInfo) {
        if (err) { return console.error(err); }
        
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
      });
}

// Needs a base 64 String to upload as attachment in saleforce

app.post('/CreateAttachment', function (req, res) {

    /*console.log(req.body);
    var base64data = new Buffer(filedata).toString('base64');

    conn.sobject("AttachMent").create({ ParentId : req.body.id,Body:'',Name:'OverNight PDF.pdf' }, function(err, ret) {
        if (err || !ret.success) { return console.error(err, ret); }
        console.log("Created record id : " + ret.id);
        // ...
    });*/
    fs.readFile(fileOnServer, function (err, filedata) {
        if (err){
            console.error(err);
        }
        else{
            var base64data = new Buffer(filedata).toString('base64');
            conn.sobject("AttachMent").create({ ParentId : req.body.id,Body:base64data,Name:'OverNight PDF.pdf' }, function(err, ret) {
                if (err || !ret.success) { return console.error(err, ret); }
                console.log("Created record id : " + ret.id);
                // ...
            });
        }
    });

   
});

app.post('/get', function (req, res) {

});

login('ajeet.kumar@training.com','jitu@2018');
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
