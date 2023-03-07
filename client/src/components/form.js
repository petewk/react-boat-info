import React, { useEffect, useState } from 'react';
import '../../node_modules/draft-js/dist/Draft.css';
import MyEditor from './editor.js';
import WysiwygEditor from './wysiwyg';

function Form(props){

    const [editing, setEditing] = useState(false);


    function cancelEdit(){
        setEditing(!editing);
    }





    return (
        <div id="formBody">
            
            
            {props.editing ? (
                <>  
                    <h1>Editing page</h1>
                    <h2>Correct the text below and hit save. Doing so will replace the original page with your ammended one</h2>

                </>
            ) : (
               <> 
                    <h1>Write a new page below</h1>
                    {/* <MyEditor /> */}

                    <WysiwygEditor />

                </>
            )}
        </div>
    )


}

export default Form;