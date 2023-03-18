import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink, Link } from 'react-router-dom';
import '../App.css';

function Success(){
    

    return(
        <div className="resultPage">
            <h1>Success!</h1>
            <h3>New page has been created!</h3>
            <h3>It will now show in the index on the home page</h3>
            <Link to="/">Return home</Link>

            <Routes>
                <Route path="/"/>
            </Routes>
        </div>
    )
}

export default Success;