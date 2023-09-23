import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../App.css';

function FileUpload(){

    return(
        <div id="uploadContainer">
            <h4>You can upload PDF files here</h4>
            <h5>File name will show in the index</h5>
            <form action='/pdf' method='POST' enctype="multipart/form-data">
                <input className="createFormInput" name="authCode" id="authCodeInput" placeholder='Enter auth code here' type="number" required></input> <br />
                <input id="pdfSelector" type='file' name="fileSent"></input> <br />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default FileUpload;