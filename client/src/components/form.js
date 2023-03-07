import React, { useEffect, useState } from 'react';
import '../../node_modules/draft-js/dist/Draft.css';
<<<<<<< Updated upstream
import MyEditor from './editor.js';
=======
import Editor from './lexical.js';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                    <h1>Write new page</h1>
                    <MyEditor />
                    {/* <h3>Here you can create a new page of info to be viewed. The title you set will be how the page shows on the Index on the left hand side of the main page, and the text content entered into the text area will be the body</h3>

                    <form action="http://localhost:5000/" method="post">
                        <label htmlFor="fileName">Page Title</label><br />
                        <input className="fileName" type="text" name="fileName" placeholder="Page title"/><br />
                        <label htmlFor="fileBody">Info body</label><br />
                        
                        <textarea className="fileBody" name="fileBody" placeholder="Input text body here"></textarea><br />

                        <button>Submit new page</button> */}
                    {/* </form> */}
=======
                    <h1>Write a new page below</h1>
                    <Editor />

>>>>>>> Stashed changes

                </>
            )}
        </div>
    )


}

export default Form;