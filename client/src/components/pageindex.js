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
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';


function PageIndex(){

    const [backendData, setBackendData] = useState([{}]);

    const [fileCurr, setFileCurr] = useState('');
    const [edit, setEdit] = useState(false);

    // Setting the text page contents
    const [fileData, setFileData] = useState({});
    const [bodyHTML, setBodyHTML] = useState("");
    const [fileTitle, setFileTitle] = useState('');


    //  Search function
    const [searchResult, setSearchResult] = useState('');
    const [searchValue, setSearchValue] = useState('');



    // testing directories

    const [directories, setDirectories] = useState([]);
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [thisDir, setThisDir] = useState('');

    // full directories/files object
    const [fullData, setFullData] = useState({});



    useEffect(()=>{
        fetch("/api")
        .then(
            response => response.json()
        ).then(
            data => {
                console.log(data.directoryInfo);
                setFullData(data.directoryInfo);
                setDirectories(Object.keys(data.directoryInfo).sort());
                setFileData(data.fileBodies)
                
                const holdingArrBodies = []
                Object.values(data.fileBodies).map((value)=>{
                        holdingArrBodies.push(value)
                });

                const holdingArrNames = [];
                Object.keys(data.fileBodies).map((name)=>{
                    holdingArrNames.push(name);
                })
                setFiles(holdingArrBodies);
                setFileNames(holdingArrNames);
            }
            
        );
    }, []);


    function findDir(fileName){
        var result;
        let keys = Object.keys(fullData);
        keys.map((key)=>{
            if(fullData[key].includes(fileName)){
                result = key
            }
        })
        return result;
    };


    function SetPage(e){

        console.log(e.target);
        var fileAtt = e.target.attributes.filename.value;
        
        //get current file name and set current file
        setFileCurr(fileAtt);
        var fileNametemp = e.target.innerHTML;
        setFileTitle(fileNametemp);

        
        if (e.target.classList.contains('searched')){
            var data = {
                "folder": findDir(fileAtt),
                "fileName": fileAtt
            };
            console.log(typeof(fileAtt));
            console.log(fullData);
            console.log(findDir(fileAtt));
            setThisDir(findDir(fileAtt));
        } else {
            var data = {
                "folder": e.target.parentElement.parentElement.previousElementSibling.innerText,
                "fileName": findDir(fileAtt)
            };
            console.log(e.target.parentElement.parentElement.previousElementSibling.innerText)
            setThisDir(e.target.parentElement.parentElement.previousElementSibling.innerText);
        }




        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };


        fetch('/getText', requestOptions).then(
            response=>response.json()
        ).then(
            data=>{
                console.log(data)
                setBodyHTML(generateHTML(data, [
                    Color,
                    TextStyle,
                    Underline,
                    StarterKit,
                    Link1,
                    Image,
                    Dropcursor,
                ]));
            }
        );
        
        
        

        

    }

    // store this info to local storage for the editor option
    useEffect(()=>{
        
        window.localStorage.setItem("editorTextBody", bodyHTML);
        window.localStorage.setItem("editorFileName", fileTitle.replaceAll(" ", "-"));
        window.localStorage.setItem("category", thisDir.replaceAll(" ", "-"));
    })

    

    // enable editing mode to change contents of existing file

    function enableEdit(){
        setEdit(!edit);
    }

    function searchFilter(e){
        const searchVal = e.target.value;
        setSearchValue(searchVal);
        let searchReturns = [];
        let fileNames = [];
        directories.map((item)=>{
            fullData[item].map((item)=>{
                fileNames.push(item)
            })
        });
        fileNames.map((item)=>{
            if(item.toLowerCase().replaceAll("-", " ").includes(searchVal.toLowerCase())){
                searchReturns.push(item)
            }
        })
        setSearchResult(searchReturns)
    }

    function collapseTest(e){
        const clickTarget = e.target.nextElementSibling;
        clickTarget.classList.toggle('collapsed');
        const arrow = e.target.lastChild;
        arrow.classList.toggle('fa-rotate-180');
        arrow.classList.toggle('closed');
    }

    
    





    return (
        <div id="container">

            {/* Page index list here */}

            <div id="pageIndex">
                <div>
                    <input id="searchBox" placeholder="Search..." onChange={searchFilter}></input>
                </div>
                        {(directories.length === 0) ? (
                            // Render when no files to show

                            <p>Loading</p> 

                        ): (

                            (searchValue === '') ? (

                            <div>
                                {/* Render when files but no search */}

                                <>
                                
                                    {directories.map((item, i)=>(
                                        <div key={i}>
                                            <p onClick={collapseTest} className='directoryHeader'>{item[0].toUpperCase() + item.substring(1).replaceAll('-', ' ')}<i className="fa-solid fa-sort-down"></i></p>
                                            <div className="testItems collapsible collapsed">
                                                {fullData[item].map((name, i)=>(
                                                    <div key={i} onClick={SetPage}>
                                                        <h5 className="indexLink" filename={name} key={name} >{name.slice(0, -5).replaceAll('-', " ")}</h5>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>

                            </div>

                            ) : (

                                // When search but no results
                                (searchResult.length === 0) ? (

                                    <p>No Results Found...</p>
                                ) 

                                : 

                                // When search and results to show

                                (
                                    searchResult.map((name, i)=>(
                                        <div key={i} onClick={SetPage} >
                                            <h5 className="indexLink searched" filename={name} key={name} >{name.slice(0, -5).replaceAll('-', " ")}</h5>
                                        </div>
                                    ))
                                )
                            )

                    
                        )}
            </div>  


            {/* Text and body going here */}

            <div id="textPage">
                {fileCurr === '' ? (
                    <>
                    <h2>Welcome to the boat test info page, select a file from the left to view info, or use the button at the top to create a new file</h2>
                    <div>
                        <ul id="guidePoints">
                            <li>Use the index on the left hand side to search for info you're looking for;</li>
                            <li>If you wish to submit new pages or edit info on an existing page, you will need an authorisation code;</li>
                            <li>If you have a suggestion for information you'd like so see a page on which you can't find, or would like to request permission to create/edit new pages, please fill out the Suggestion form through the link in the top right of your screen</li>
                        </ul>
                    </div>
                    </>
                ) : (
                    
                    <>
                        <h1>
                            {fileTitle}
                        </h1>
                        <div dangerouslySetInnerHTML={{__html: bodyHTML}}>{}</div>
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