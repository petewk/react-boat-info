import React, { useEffect, useState } from 'react';
import Form from './components/form.js';
import PageIndex from './components/pageindex.js';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';


function App(){

    const [submitForm, setSubmitForm] = useState();
    
    function showForm(){
        setSubmitForm(!submitForm);
    }

    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav id="navBar">
                        <h1 id="logo">Piper Info</h1>
                        
                        <div id="links">
                        {submitForm ? (
                            <Link onClick={showForm}> Return</Link>
                        ):(
                            <>
                            <Link className="navLink" to="form" onClick={showForm}>Submit form</Link>
                            <Link className="navLink"></Link>
                            <Link className="navLink">Suggest</Link>
                            </>
                        )}
                        </div>

                    </nav>
                </header>


                {submitForm ? (
                <Routes>
                    <Route path="form" element={<Form />}/>
                </Routes>
                ) : (
                    <PageIndex />
                )}
                
            </div>
        </BrowserRouter>
    )
}

export default App;