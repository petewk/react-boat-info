import React, { useEffect, useState } from 'react';
import '../../node_modules/draft-js/dist/Draft.css';
import Editor from './tiptap/Editor';


function Form(props){

    const [editing, setEditing] = useState(false);

    // useEffect(()=>{
    //     fetch("http://localhost:5000/rich", {
    //         method: "POST",
    //         mode: 'no-cors',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //     })
    // })

    function cancelEdit(){
        setEditing(!editing);
    }





    return (
        <div id="formBody">
            
            
            {props.editing ? (
                <>  
                    <h1>Editing page</h1>
                    <h2>Correct the text below and hit save. Doing so will replace the original page with your ammended one</h2>
                    {/* <form action="http://localhost:5000/" method="post">
                        <input name='toDelete' className="fileName" value={props.fileName}></input> 
                        <br></br>
                        <h3>Will become</h3>
                        <br></br>
                        <input className="fileName" name='fileName' defaultValue={props.fileName}></input>
                        <br></br>
                        <textarea className="fileBody" name='fileBody' defaultValue={props.fileText}></textarea>
                        <button type='submit'>Save new</button>
                        <button onClick={cancelEdit}>Cancel Edit</button>
                    </form> */}
                </>
            ) : (
               <> 
                    <h1>Write a new page below</h1>
                    <Editor />

                </>
            )}
        </div>
    )


}

export default Form;