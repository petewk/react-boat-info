import React, { useEffect, useState } from 'react';
import PageIndex from './components/pageindex.js';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Success from './components/success';
import Failure from './components/failure';
import Editor from './components/tiptap/EditorPage';
import EntryPage from './components/tiptap/EntryPage.js';


function App(){

    const [submitForm, setSubmitForm] = useState();
    const [needReturn, setNeedReturn] = useState();
    
    function showForm(){
        setSubmitForm(!submitForm);
        setNeedReturn(!needReturn);
    }

    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav id="navBar">
                        <Link to='/'><h1 id="logo">Piper Info</h1></Link>
                        
                        <div id="links">
                        {needReturn ? (
                            <Link onClick={showForm} to="/" className="navLink"> Return</Link>
                        ):(
                            <>
                            <Link className="navLink" to="submit" onClick={showForm}>Submit form</Link>
                            <Link className="navLink">Suggest</Link>
                            </>
                        )}
                        </div>

                    </nav>
                </header>


                <Routes>                 
                    <Route path="/" element={<PageIndex />}/>
                    <Route path="/edit" element={<Editor />}/>
                    <Route path="success" element={<Success />}/>
                    <Route path="failure" element={<Failure />}/>
                    <Route path="/submit" element={<EntryPage/>}/>
                </Routes>


                
            </div>
        </BrowserRouter>
    )
}

export default App;