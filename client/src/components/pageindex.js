import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink } from 'react-router-dom';
import '../App.css';
import Form from './form.js';

function PageIndex(){

    const [backendData, setBackendData] = useState([{}]);
    const [fileNames, setFileNames] = useState([]);
    const [fileConts, setFileConts] = useState([]);
    const [fileCurr, setFileCurr] = useState('');
    const [edit, setEdit] = useState(false);


    useEffect(()=>{
        fetch("/api")
        .then(
            response => response.json()
        ).then(
            data => {
                setFileNames(Object.keys(data));
                setFileConts(Object.values(data));
            }
            
        )
    }, []);

    function setPage(e){
        var file = e.target.innerHTML;
        setFileCurr(fileNames[fileNames.indexOf(file)]);
    }

    function enableEdit(){
        setEdit(!edit);
    }

    function EditFile(){
        useEffect(()=>{
            fetch("/edit")
            .then(
                response => response.json()
            ).then(
                data => console.log(data)
            )
        })
    }


    return (
        <div id="container">
            <div id="pageIndex">

                        {(fileNames.length === 0) ? (
                            <p>Loading</p>
                        ): (
                            fileNames.map((item, i)=>(
                                <div key={i}>
                                    <h5  className="indexLink" onClick={setPage}>{item}</h5>
                                </div>
                            ))
                        )}
            </div>  
            <div id="textPage">
                {fileCurr === '' ? (
                    <h2>Welcome to the boat info page, select a file from the left to view info, or use the button at the top to create a new file</h2>
                ) : (
                    edit ? (
                        <Form editing='true' fileName={fileNames[fileNames.indexOf(fileCurr)]} fileText={fileConts[fileNames.indexOf(fileCurr)]}/>
                    ) : (
                        <>
                        <h1>
                            {fileNames[fileNames.indexOf(fileCurr)]}
                        </h1>
                        <h2>
                            {fileConts[fileNames.indexOf(fileCurr)]}
                        </h2>
                        <button onClick={enableEdit}>Edit text</button>
                    </>
                    )
                )
                    }
                
            </div>
        </div>

    )
}

export default PageIndex