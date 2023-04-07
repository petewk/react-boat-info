const express = require ('express');
const bodyParser = require ('body-parser');
const fs = require('fs');



const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



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

    const body = JSON.parse(request.body.hiddenForm);
    const fileName = request.body.fileName.replace(/\s/g, "-");

    // // CHECK AUTH CODE USED HERE

    const authCode = request.body.authCode;
    console.log(authCode);

    authQuery = "SELECT * FROM user_ids WHERE user_id = ?";
    db.query(authQuery, [authCode], (req, response)=>{
        console.log(req);
        console.log(response.length);
        if(response.length===0){

            console.log("Invalid auth")
            res.redirect("http://localhost:3000/failure")

        } else {
            console.log("Valid auth")
            res.redirect("http://localhost:3000/success");

            
            fs.writeFileSync(__dirname + '/textfiles/' + request.body.category + '/' + fileName + '.json', JSON.stringify(body), (err)=>{
                if (err) throw err;
            });

            

            const date = new Date();
            const sqlInsert = "INSERT INTO create_log (creation-date, page_name, created-by) VALUES (?,?,?)"

            db.query(sqlInsert, [date, fileName, authCode], (err, result)=>{

                if (err){console.log(err)} 
                console.log(result);

  
            });

        }

    });



})

app.listen(5000, ()=>{
    console.log("running on 5000")
});
