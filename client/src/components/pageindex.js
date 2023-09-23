import React, { useEffect, useState, forwardRef,  useImperativeHandle } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../App.css';
import IndexItem from './listItem.js';
import UpdatesSection from './updates.js';



// Tiptap imports

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
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import { Document, Page, pdfjs } from 'react-pdf';
import { Base64 } from 'js-base64';


const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();



const PageIndex = forwardRef((props, ref)=>{
    useImperativeHandle(ref, ()=>({
        setBlankPage(){
            setFileCurr('')
        },
    }))


    const [backendData, setBackendData] = useState([{}]);

    const [fileCurr, setFileCurr] = useState(props.fileCurr);
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
    const [updates, setUpdates] = useState([]);


    // store PDF
    const [pdfFile, setpdfFile] = useState('');
    const [numPages, setnumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess(pdf){
        setnumPages(pdf._pdfInfo.numPages);
      }




    useEffect(()=>{
        fetch("/api")
        .then(
            response => response.json()
        ).then(
            data => {
                setUpdates(data.updateLogs);
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

        let fileAtt;
        let fileNametemp;
        
        if(e.target.classList.contains('fa-file-pdf')){
            fileAtt = e.target.parentElement.attributes.filename.value;
            fileNametemp = e.target.parentElement.innerHTML;
        } else {
            fileAtt = e.target.attributes.filename.value;
            fileNametemp = e.target.innerHTML;
        }

        console.log(fileAtt);
        
        //get current file name and set current file
        setFileCurr(fileAtt);

        setFileTitle(fileNametemp.split('<')[0]);

    
        var data = {
            "folder": findDir(fileAtt),
            "fileName": fileAtt
        };
        setThisDir(findDir(fileAtt));


        function base64encode(str) {
            return btoa(unescape(encodeURIComponent(str)))
          }
       

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        if (fileAtt.includes('.pdf')){
            fetch('/getText', requestOptions).then(
                response=>response.body
            ).then(              
                data=>{
                    const reader = data.getReader();
                    return new ReadableStream({
                      start(controller) {
                        return pump();
                        function pump() {
                          return reader.read().then(({ done, value }) => {
                            // When no more data needs to be consumed, close the stream
                            if (done) {
                              controller.close();
                              return;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                            return pump();
                          });
                        }
                      },
                    });
                  })
                  // Create a new response out of the stream
                  .then((stream) => new Response(stream))
                  // Create an object URL for the response
                  .then((response) => response.blob())
                  .then((blob) => URL.createObjectURL(blob))
                  // Update image
                  .then((url) => setpdfFile(url))
                  .catch((err) => console.error(err));
        } else {
            fetch('/getText', requestOptions).then(
                response=>response.json()
            ).then(
                data=>{
                    setBodyHTML(generateHTML(data, [
                        Color,
                        TextStyle,
                        Underline,
                        StarterKit,
                        Link1,
                        Image,
                        Dropcursor,
                        TableRow,
                        TableHeader,
                        TableCell,
                        Table,
                    ]));
                }
            );
        }


    }


    function pageUp(){
        if(pageNumber < numPages){
            setPageNumber(pageNumber + 1)
        }

    }

    function pageDown(){
        if(pageNumber > 1){
            setPageNumber(pageNumber - 1)
        }
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
        let clickTarget;
        let arrow;
        if(e.target.classList.contains('fa-solid')){
            clickTarget = e.target.parentElement.nextElementSibling;
            arrow = e.target;
        } else {
            clickTarget = e.target.nextElementSibling;
            arrow = e.target.lastChild;
        };
        console.log("hello")
        clickTarget.classList.toggle('collapsed');
        
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
                                                {
                                                    fullData[item].length > 0 ? 
                                                
                                                fullData[item].map((name, i)=>(

                                                    name.includes('.pdf') ? (
                                                    <div key={i} onClick={SetPage}>
                                                        <IndexItem filename={name} key={name}/>
                                                    </div>
                                                    )

                                                    :

                                                    (
                                                    <div key={i} onClick={SetPage}>
                                                        <IndexItem filename={name} key={name}/>
                                                    </div>
                                                    )
                                                ))
                                            
                                                    :

                                                    <p className="emptyDirectory">Nothing here yet!</p>
                                            
                                            }
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
                                    (searchResult.map((name, i)=>(
                                        name.includes('.pdf') ? (
                                        <div key={i} onClick={SetPage} >
                                            <h5 className="indexLink searched" filename={name} key={name} >{name.slice(0, -4).replaceAll('-', " ")}</h5>
                                        </div>
                                        )
                                         :
                                        (
                                        <div key={i} onClick={SetPage} >
                                                <h5 className="indexLink searched" filename={name} key={name} >{name.slice(0, -5).replaceAll('-', " ")}</h5>
                                        </div>
                                        )
                                    ))
                                )
                                )
                            )

                    
                        )}
            </div>  


            {/* Text and body going here */}

            <div id="textPage">
                {fileCurr === '' ? (
                    <>
                    <div id="defaultScreen">
                        <h2>Welcome to the boat info wiki page, select a file from the left to view info, or use the button at the top to create a new file</h2>
                        <div>
                            <ul id="guidePoints">
                                <li>Use the index on the left hand side to search for info you're looking for;</li>
                                <li>If you wish to submit new pages or edit info on an existing page, you will need an authorisation code;</li>
                                <li>If you have a suggestion for information you'd like so see a page on which you can't find, or would like to request permission to create/edit new pages, please fill out the Suggestion form through the link in the top right of your screen</li>
                            </ul>
                        </div>
                    </div>
                    <UpdatesSection updates={updates}/>
                    </>

                ) : (
                    (fileCurr.includes('.pdf')) ? (
                    <>
                        <h1>{fileCurr.slice(0, -4)}</h1>
                        <div className='pdfPageControls'>
                            <button className="pagesButton" onClick={pageDown}><i class="fa-solid fa-minus"></i></button>
                            <b>{pageNumber} of {numPages}</b>
                            <button className="pagesButton" onClick={pageUp}><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <Document className='pdfContainer' file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={pageNumber}/>
                        </Document>
                    </>
                    )
                    :
                    (
                    <>
                        <h1>
                            {fileTitle}
                        </h1>
                        <div className='textBody' dangerouslySetInnerHTML={{__html: bodyHTML}}>{}</div>
                        <Link to="/edit">
                        <button id="editButton">Edit <i class="fa-solid fa-pen"></i></button>
                        </Link>
                        
                    </>
                    )

                    
                    )
                }
                
            </div>
        </div>

    )
}
)

export default PageIndex