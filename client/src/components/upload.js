import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../App.css';

function FileUpload(){

    return(
        <>
            <h4>Upload files here</h4>
            <form action='/pdf' method='POST' enctype="multipart/form-data">
                <input className="createFormInput" name="authCode" id="authCodeInput" placeholder='Enter auth code here' type="number" required></input>
                <input className="createFormInput" id="fileNameInput" placeholder='Page Title' name="fileName"></input> <br />
                <input type='file' name="file"></input>
                <button>Submit</button>
            </form>
        </>
    )
}

export default FileUpload;