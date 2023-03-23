const express = require ('express');
const bodyParser = require ('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());




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

    console.log(filesFull);

    res.json({directoryInfo: directoriesFiles, fileBodies: filesFull});

    // This creates two arrays of all filenames and all file contents

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


    // This part is creating files 


    var filename = req.body.fileName.replace(/\s/g, "")
    fs.writeFileSync(__dirname + '/textfiles/' + filename + ".txt", req.body.fileBody, (err)=>{
        if(err) throw err;
        console.log("New file " + req.body.fileName + " created");
    })
    res.redirect("http://localhost:3000")
});


app.post("/rich", (req, res)=>{
    const body = JSON.parse(req.body.hiddenForm);
    console.log(body);
    const fileName = req.body.fileName.replace(/\s/g, "-");
    fs.writeFileSync(__dirname + '/textfiles/' + fileName + '.json', body, (err)=>{
        if (err) throw err;
        console.log("New file created")
    })
    res.redirect("http://localhost:3000")
})

app.listen(5000, ()=>{
    console.log("running on 5000")
});
