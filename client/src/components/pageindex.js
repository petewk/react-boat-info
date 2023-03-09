import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink } from 'react-router-dom';
import '../App.css';
import Form from './form.js';


// Lexical imports

import { Color } from '@tiptap/extension-color'
import Bold from '@tiptap/extension-bold';
import Paragraph from '@tiptap/extension-paragraph';
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import {Underline} from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { generateHTML } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image'


function PageIndex(){

    const [backendData, setBackendData] = useState([{}]);
    const [fileNames, setFileNames] = useState([]);
    const [fileConts, setFileConts] = useState([]);
    const [fileCurr, setFileCurr] = useState('');
    const [edit, setEdit] = useState(false);
    const [jsonCont, setJsonCont] = useState([{}]);
    const [bodyHTML, setBodyHTML] = useState("");
    const [fileTitle, setFileTitle] = useState('');


    useEffect(()=>{
        fetch("/api")
        .then(
            response => response.json()
        ).then(
            data => {
                setFileNames(Object.keys(data));
                setFileConts(Object.values(data));
            }
            
        );
    }, []);



    function SetPage(e){
        //get current file name and set current file
        setFileCurr(e.target.attributes.fileName.value);
        var fileNametemp = e.target.innerHTML;
        setFileTitle(fileNametemp);

        //take that file contents and retrieve to HTML
        var fileBody = fileConts[fileNames.indexOf(fileNametemp)]
        var fileName = fileNametemp.replaceAll(' ', "-") + '.json';
        setBodyHTML(generateHTML(JSON.parse(fileConts[fileNames.indexOf(fileName)]), [
            Color,
            TextStyle,
            Underline,
            StarterKit,
            Link,
            Image,
        ]))

    }

    // set content body here on effect hook to force on re-render

    useEffect(()=>{
        
    });

    

    // enable editing mode to change contents of existing file

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
                                    <h5  className="indexLink" filename={item} onClick={SetPage}>{item.slice(0, -5).replaceAll('-', " ")}</h5>
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
                            {fileTitle}
                        </h1>
                        <div dangerouslySetInnerHTML={{__html: bodyHTML}}></div>

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