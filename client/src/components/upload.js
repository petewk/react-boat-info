import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../App.css';

function FileUpload(){

    const [categories, setCategories] = useState([])

      useEffect(()=>{
        fetch("/api")
        .then(
            response => response.json()
        ).then(
            data => {

              setCategories(Object.keys(data.directoryInfo).sort())
            }
            
        );
    }, []);

    return(
        <div id="uploadContainer">
            <h4>You can upload PDF files here</h4>
            <h5>File name will show in the index</h5>
            <form action='/pdf' method='POST' enctype="multipart/form-data">
                <input className="createFormInput" name="authCode" id="authCodeInput" placeholder='Enter auth code here' type="number" required></input> <br />
                <input id="pdfSelector" type='file' name="fileSent"></input> <br />
                <select name="category" id="categorySelect" required>
              <option disabled selected hidden>Please Choose a Category...</option>
              {
                categories.map((item, index)=>(
                  <option value={item}>{item[0].toUpperCase() + item.substring(1).replaceAll("-", " ")}</option>
                ))
              }
            </select>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default FileUpload;