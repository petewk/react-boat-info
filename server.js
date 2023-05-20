const express = require ('express');
const bodyParser = require ('body-parser');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 5000;
const fileupload = require('express-fileupload');
const AWS = require('aws-sdk');





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
    password: '6dc23cff',
    database: 'heroku_88822737ee106d6'
});



app.get("/api", (req, res)=>{


  // s3 get files testing

  params = {
    Bucket: 'boat-info-bucket',
    MaxKeys: 20,
    Delimiter: '/',
  }

  s3_directories = [];

  s3.listObjectsV2(params, (err, data)=>{
    if (err) {
      console.log(err)
    } else {
      data.CommonPrefixes.map((item)=>{
        s3_directories.push(item.Prefix);
      })
    }
  })

  console.log(s3_directories)

    // This creates object of directories and files for the index

    var filesFull = {};
    var directories = [];
    var directoriesFiles = {};

    fs.readdirSync(__dirname + '/textfiles').forEach(
        (curr, index)=>{
            directories.push(curr)
        }
    )

    s3_directories.forEach((curr, index)=>{
        directoriesFiles[curr] = fs.readdirSync(__dirname + '/textfiles/' + curr);
        directoriesFiles[curr].forEach((item, index)=>{
            filesFull[item] = fs.readFileSync(__dirname + '/textfiles/' + curr + '/' + item, 'utf-8')
        });

        

    });

    res.json({directoryInfo: directoriesFiles, fileBodies: filesFull});

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

            res.redirect("https://test-structure.herokuapp.com/failure")

        } else {
            res.redirect("https://test-structure.herokuapp.com/success");

            
            fs.writeFileSync(__dirname + '/textfiles/' + request.body.category + '/' + fileName + '.json', JSON.stringify(body), (err)=>{
                if (err) throw err;
            });


            //THIS SECTION FOR SAVING FILES TO S3

            console.log('/' + request.body.category + '/' + fileName +'.json');
            
            s3.putObject({
              Body: JSON.stringify(body),
              Bucket: 'boat-info-bucket',
              Key: request.body.category + '/' + fileName +'.json'
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
