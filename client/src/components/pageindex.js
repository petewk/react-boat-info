import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink } from 'react-router-dom';
import '../App.css';
import Form from './form.js';
import MyEditor from './editor.js';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, convertFromHTML } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

function PageIndex(){

    const [backendData, setBackendData] = useState([{}]);
    const [fileNames, setFileNames] = useState([]);
    const [fileConts, setFileConts] = useState([]);
    const [fileCurr, setFileCurr] = useState('');
    const [edit, setEdit] = useState(false);
    const [fileName, setFileName] = useState('');
    const [jsonCont, setJsonCont] = useState([{}]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [bodyHTML, setBodyHTML] = useState();


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
        var file = e.target.attributes.filename.value;
        var jsonData = fileConts[fileNames.indexOf(file)];
        setFileCurr(fileNames[fileNames.indexOf(file)]);

        // trying setpagecontent function

        const rawEditorData = JSON.parse(jsonData);
        if (rawEditorData !== null){
            const contentState = convertFromRaw(rawEditorData);
            const newEditorState = EditorState.createWithContent(contentState);
            setEditorState(newEditorState)
        };

        const content = editorState.getCurrentContent()

        setBodyHTML(stateToHTML(content));
        console.log(stateToHTML(content));

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
                                    <h5  className="indexLink" filename={item} onClick={setPage}>{item.slice(0, -5).replaceAll('-', " ")}</h5>
                                </div>
                            ))
                        )}
            </div>  
            <div id="textPage">
                {fileCurr === '' ? (
                    <>
                    <h2>Welcome to the boat info page, select a file from the left to view info, or use the button at the top to create a new file</h2>
                    </>
                ) : (
                    edit ? (
                        <Form editing='true' fileName={fileNames[fileNames.indexOf(fileCurr)]} fileText={fileConts[fileNames.indexOf(fileCurr)]}/>
                    ) : (
                        <>
                        <h1>
                            {fileNames[fileNames.indexOf(fileCurr)].slice(0, -5).replaceAll('-', " ")}
                        </h1>
                        <div id="bodyDiv" key="body" dangerouslySetInnerHTML={{__html: bodyHTML}}>

                        </div>
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