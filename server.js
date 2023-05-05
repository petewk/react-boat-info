const express = require ('express');
const bodyParser = require ('body-parser');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 5000;



const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'client/build')));

// Didn't need this, actually broke it, but keeping here
//   // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });


const mysql = require('mysql2'); 

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Holborough4691!',
    database: 'boat-info'
});



app.get("/api", (req, res)=>{

    // This creates object of directories and files for the index

    var filesFull = {};
    var directories = [];
    var directoriesFiles = {};

    fs.readdirSync(__dirname + '/textfiles').forEach(
        (curr, index)=>{
            directories.push(curr)
        }
    )

    directories.forEach((curr, index)=>{
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

            res.redirect("http://localhost:3000/failure")

        } else {
            res.redirect("http://localhost:3000/success");

            
            fs.writeFileSync(__dirname + '/textfiles/' + request.body.category + '/' + fileName + '.json', JSON.stringify(body), (err)=>{
                if (err) throw err;
            });

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
    console.log("running on 5000 great stuff");
});
