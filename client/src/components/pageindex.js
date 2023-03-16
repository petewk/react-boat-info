import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink, Link } from 'react-router-dom';
import '../App.css';


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
import {Link as Link1} from '@tiptap/extension-link';
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
        var fileBody = fileConts[fileNames.indexOf(fileNametemp)];
        var fileName = fileNametemp.replaceAll(' ', "-") + '.json';
        setBodyHTML(generateHTML(JSON.parse(fileConts[fileNames.indexOf(fileName)]), [
            Color,
            TextStyle,
            Underline,
            StarterKit,
            Link1,
            Image,
        ]))

        // store this info to local storage for the editor option

    }


    useEffect(()=>{
        window.localStorage.setItem("editorTextBody", bodyHTML);
        window.localStorage.setItem("editorFileName", fileTitle);
    })

    

    // enable editing mode to change contents of existing file

    function enableEdit(){
        setEdit(!edit);
    }


    


    return (
        <div id="container">

            {/* Page index list here */}

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


            {/* Text and body going here */}

            <div id="textPage">
                {fileCurr === '' ? (
                    <>
                    <h2>Welcome to the boat info page, select a file from the left to view info, or use the button at the top to create a new file</h2>
                    </>
                ) : (
                    
                    <>
                        <h1>
                            {fileTitle}
                        </h1>
                        <div dangerouslySetInnerHTML={{__html: bodyHTML}}></div>

                        <Link to="/edit">
                        <button id="editButton">Edit text</button>
                        </Link>
                        
                    </>
                    )
                }
                
            </div>
        </div>

    )
}

export default PageIndex