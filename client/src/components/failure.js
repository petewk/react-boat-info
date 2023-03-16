import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink, Link } from 'react-router-dom';
import '../App.css';
import PageIndex from './pageindex.js';

function Failure(){
    

    return(
        <div className="resultPage">
            <h1>There's been a problem</h1>
            <h3>New page has not been created!</h3>
            <h3>This is likely because of a problem with the Auth code you submitted</h3>
            <Link to="/">Return home</Link>

            {/* <Routes>
                <Route path="/" element={<PageIndex />}/>   
            </Routes> */}
        </div>

        
    )
}

export default Failure;