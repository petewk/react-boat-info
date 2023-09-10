const express = require ('express');
const bodyParser = require ('body-parser');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 5000;
const fileupload = require('express-fileupload');
const AWS = require('aws-sdk');
const multer = require('multer');





const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const s3 = new AWS.S3();
app.use(fileupload());


// This is for setting up connection to the S3 client for saving files

const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: "eu-west-2",
};



const s3Client = new S3Client(s3Config);



app.use(express.static(path.join(__dirname, 'client/build')));

// Didn't need this, actually broke it, but keeping here
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });


// mysql://b218872c6def64:6dc23cff@eu-cdbr-west-03.cleardb.net/heroku_88822737ee106d6?reconnect=true

const mysql = require('mysql2'); 
const e = require('express');

const db = mysql.createPool({
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'b218872c6def64',
    password: process.env.CLEARDB_PASSWORD_BOATINFO,
    database: 'heroku_88822737ee106d6'
});


app.get("/api", async (req, res)=>{

  // GETS THE DIRECTORIES FROM S3

  const dirParams = {
    Bucket: 'boat-info-bucket',
    Delimiter: '/'
  }

  try {
    var directories = await s3.listObjectsV2(dirParams).promise();
  } catch (e) {
    var directories = {
      CommonPrefixes: [],
      two: "bye"
    };
    console.log(e);
  };
  
  s3Directories = directories.CommonPrefixes.map((item)=>{
    return item.Prefix.replace('/', '')
  });

  
  // GETS THE FILES FROM S3 AND ORGANISE WITH DIRECTORIES

  var fulls3Array = {};


  s3Directories.forEach((directory)=>{
    fulls3Array[directory] = new Array();
  });


  const fileParams = {
    Bucket: 'boat-info-bucket',
    Delimiter: '.json',
  };


  try {
    rawArray = await s3.listObjectsV2(fileParams).promise()
  } catch(e) {
    console.log(e)
  };

  var newArray = [];

  rawArray.CommonPrefixes.forEach((item)=>{
    newArray.push(item.Prefix)
  });

  
  s3Directories.map((directory)=>{
    newArray.map((item)=>{
      if(item.includes(directory)){
        fulls3Array[directory].push(item.replace(directory + '/', ''))
      }
    })
  });



   
    // This creates object of directories and files for the index

    var filesFull = {};


    // s3Directories.forEach((curr, index)=>{
    //     directoriesFiles[curr] = fs.readdirSync(__dirname + '/textfiles/' + curr);
    //     directoriesFiles[curr].forEach((item, index)=>{
    //         filesFull[item] = fs.readFileSync(__dirname + '/textfiles/' + curr + '/' + item, 'utf-8')
    //     });

    // });

    res.json({directoryInfo: fulls3Array, fileBodies: filesFull});

    });



app.post("/getText", async (req, res)=>{

  console.log(req.body.fileName);

  params = {
    Key: req.body.folder + '/' + req.body.fileName,
    Bucket: 'boat-info-bucket'
  }

  // console.log(params.Key);

  try {
    var file = await s3.getObject(params).promise();
  } catch (e) {
    console.log(e)
  };

  let parseFile = JSON.parse(file.Body);
  res.send(parseFile);
  
});





app.post("/", (req, res)=>{

    // To delete files?not sure 


    // var existingFiles = fs.readdirSync(__dirname + '/textfiles');
    // toDelete = req.body.toDelete + '.txt';
    // if (existingFiles.includes(toDelete)){
    //     fs.unlinkSync('./textFiles/' + toDelete, (err)=>{
    //         if (err) throw err;
    //     })
    // }



    // var filename = req.body.fileName.replace(/\s/g, "")
    // fs.writeFileSync(__dirname + '/textfiles/' + filename + ".txt", req.body.fileBody, (err)=>{
    //     if(err) throw err;
    //     console.log("New file " + req.body.fileName + " created");
    // })
    // res.redirect("http://localhost:3000")
});

app.get('/success', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), function(err) {
      if (err) {
        console.log(err)
      }
    })
  });

  app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), function(err) {
      if (err) {
        console.log(err)
      }
    })
  });

  app.get('/submit', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), function(err) {
      if (err) {
        console.log(err)
      }
    })
  });

app.post('/pdf', (request, res)=>{

  console.log('posting PDF');
  const authCode = request.body.authCode;
  console.log(request.body.file);


  authQuery = "SELECT * FROM user_ids WHERE user_id = ?";
  db.query(authQuery, [authCode], (req, response)=>{
      if(response.length===0){

          res.redirect("https://boat-wiki.herokuapp.com/failure")

      } else {
          res.redirect("https://boat-wiki.herokuapp.com/success");

      s3.putObject({
        Body: request.body.file,
        Bucket: 'boat-info-bucket',
        Key: 'Test Files/' + request.body.fileName + '.pdf'
      })

  }})

});


app.post("/rich", (request, res)=>{



    console.log("Rich post request");

    const body = JSON.parse(request.body.hiddenForm);
    const fileName = request.body.fileName.replace(/\s/g, "-");

    // // CHECK AUTH CODE USED HERE

    const authCode = request.body.authCode;
    const type = request.body.hiddenFormtype;
    console.log(authCode);
    console.log(type);

    authQuery = "SELECT * FROM user_ids WHERE user_id = ?";
    db.query(authQuery, [authCode], (req, response)=>{
        if(response.length===0){

            res.redirect("https://boat-wiki.herokuapp.com/failure")

        } else {
            res.redirect("https://boat-wiki.herokuapp.com/success");

            
            // fs.writeFileSync(__dirname + '/textfiles/' + request.body.category + '/' + fileName + '.json', JSON.stringify(body), (err)=>{
            //     if (err) throw err;
            // });


            //THIS SECTION FOR SAVING FILES TO S3

            console.log('/' + request.body.category + '/' + fileName +'.json');
            
            s3.putObject({
              Body: JSON.stringify(body),
              Bucket: 'boat-info-bucket',
              Key: request.body.category.replace('-', ' ') + '/' + fileName +'.json'
            }).promise();

            

            const date = new Date();

            if(type==="create"){
                const sqlInsert = "INSERT INTO page_creation (creation_date, page_name, created_by) VALUES (?,?,?)";

                db.query(sqlInsert, [date, fileName, authCode], (err, result)=>{
    
                    if (err){console.log(err)} 
                    console.log(result);
    
      
                });
            } else if(type==="edit"){
                const sqlInsert = "INSERT INTO page_edits (change_date, category, page_name, changed_by) VALUES (?,?,?,?)";

                db.query(sqlInsert, [date, 'test', fileName, authCode], (err, result)=>{
                    if (err){console.log(err)};
                })
            }

            


        }

    });



})

app.listen(port, ()=>{
    console.log("running on 5000 great stuff 2");
});
