const express = require ('express');
const bodyParser = require ('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysqlroot4691!',
    database:   'change_log'
})




app.get("/api", (req, res)=>{

    // making json of filename, text pairs
    var filesFull = {};

    fs.readdirSync(__dirname + '/textfiles').forEach(
        (curr, index)=>{
            txtval = curr.replace('.txt', '');
            data = fs.readFileSync(__dirname + '/textfiles/' + curr, 'utf8')
            filesFull[txtval] = data;
        });

    var filesFullOrdered = Object.keys(filesFull).sort();

    res.json(filesFull);

    });

app.post("/", (req, res)=>{

    console.log("Plain text request")
    var existingFiles = fs.readdirSync(__dirname + '/textfiles');
    toDelete = req.body.toDelete + '.txt';
    if (existingFiles.includes(toDelete)){
        fs.unlinkSync('./textFiles/' + toDelete, (err)=>{
            if (err) throw err;
        })
    }


    var filename = req.body.fileName.replace(/\s/g, "")
    fs.writeFileSync(__dirname + '/textfiles/' + filename + ".txt", req.body.fileBody, (err)=>{
        if(err) throw err;
        console.log("New file " + req.body.fileName + " created");
    })
    res.redirect("http://localhost:3000")
});


app.post("/rich", (req, res)=>{
    const body = req.body.hiddenForm;
    const fileName = req.body.fileName.replace(/\s/g, "-");
    const authCode = req.body.authCode;




    // CHECK AUTH CODE USED HERE

    authQuery = "SELECT * FROM user_ids WHERE user_id = ?"
    db.query(authQuery, [authCode], (req, response)=>{
        console.log(response.length);
        if(response.length===0){
            res.redirect("http://localhost:3000/failure")
        } else {
            res.redirect("http://localhost:3000/success");

            fs.writeFileSync(__dirname + '/textfiles/' + fileName + '.json', body, (err)=>{
                if (err) throw err;
            });

            const date = new Date();
            const sqlInsert = "INSERT INTO create_log (create_date, file_name, user_id) VALUES (?,?,?)"

            db.query(sqlInsert, [date, fileName, authCode], (err, result)=>{

                if (err){console.log(err)} 

  
            });

        }
    });

    // SQL INSTER SECTION HERE

    
})

app.listen(5000, ()=>{
    console.log("running on 5000")
});
