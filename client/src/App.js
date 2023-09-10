import React, { useEffect, useState } from 'react';
import PageIndex from './components/pageindex.js';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Success from './components/success';
import Failure from './components/failure';
import Editor from './components/tiptap/EditorPage';
import EntryPage from './components/tiptap/EntryPage.js';
import SuggestPage from './components/suggest.js';
import FileUpload from './components/upload.js'


function App(){

    const [submitForm, setSubmitForm] = useState();
    const [needReturn, setNeedReturn] = useState();
    
    function showForm(){
        setSubmitForm(!submitForm);
        setNeedReturn(!needReturn);
    }

    function removeReturn(){
        setNeedReturn(false);
    }

    function setReturn(){
        setNeedReturn(!needReturn);
    }

    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav id="navBar">
                        <Link to='/' onClick={removeReturn}><h1 id="logo">Piper Info</h1></Link>
                        
                        <div id="links">
                        {needReturn ? (
                            <Link onClick={showForm} to="/" className="navLink" id="return"> <i class="fa-solid fa-rotate-left"></i></Link>
                        ):(
                            <>
                            <div><Link className="navLink" to="submit" onClick={showForm}><i class="fa-solid fa-pen-to-square"></i> <br /> <b>Submit</b></Link></div>
                            <div><Link className="navLink" to="/upload" onClick={setReturn}><i class="fa-regular fa-file-pdf"></i> <br /> <b>Upload</b></Link></div>
                            <div><Link className="navLink" to="/suggest" onClick={setReturn}><i class="fa-regular fa-envelope"></i> <br /> <b>Suggest</b></Link></div>
                            </>
                        )}
                        </div>
                    </nav>
                </header>


                <Routes>                 
                    <Route path="/" element={<PageIndex />}/>
                    <Route path="/edit" element={<Editor />}/>
                    <Route path="/upload" element={<FileUpload />}/>
                    <Route path="/success" element={<Success />}/>
                    <Route path="/failure" element={<Failure />}/>
                    <Route path="/submit" element={<EntryPage/>}/>
                    <Route path="/suggest" element={<SuggestPage />}/>
                </Routes>


                
            </div>
        </BrowserRouter>
    )
}

export default App;