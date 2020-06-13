var sf = require('node-salesforce');
const express = require('express')
const app = express()
const port = '3000';
const bodyParser = require("body-parser");
var myConVar;
const fs = require('fs');
var fileOnServer = 'C:\\Users\\USER\\Desktop\\node_to_sf\\Dec2019Payslip.pdf',
    fileName = 'MyRandomImage.pdf',
    fileType = 'pdf';



app.use(bodyParser.json());
var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
   loginUrl : 'https://login.salesforce.com'
});
conn.login('ajeet.kumar@training.com', 'jitu@2018', function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  myConVar = conn;
  // ...
});
app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


app.get('/getDetails', function (req, res) {
    /*//curl https://mylighning-dev-ed.my.salesforce.com/services/data/v20.0/sobjects/Attachment/001D000000INjVe/body -H "Authorization: Bearer token"
    conn.apex.get("/customrest/", function(res) {
        console.log('res');
        console.log(res);
        // the response object structure depends on the definition of apex class
      });*/
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

