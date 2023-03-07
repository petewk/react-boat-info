import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import '../App.css';
import '../../node_modules/draft-js/dist/Draft.css';
import DisplayEditor from './displayEditor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MyEditor extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
        this.saveContent = this.saveContent.bind(this);
        this.loadcontent = this.loadContent.bind(this);
        this.setEditorContent = this.setEditorContent.bind(this);
        this.gettoHTML = this.gettoHTML.bind(this);
    }
    handleKeyCommand(command){
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }


    getRaw(){
        const contentState = this.state.editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        return JSON.stringify(raw, null, 2);
    }

    saveContent(){
        const jsontoSave = this.getRaw();
        const input = document.getElementById('hiddenForm');
        input.value = JSON.stringify(jsontoSave);
        localStorage.setItem('draftEditorContent', jsontoSave);
        console.log("saved")
    }

    loadContent(){
        const savedData = localStorage.getItem('draftEditorContent');
        return savedData ? JSON.parse(savedData) : null;
    }

    gettoHTML(){
        const contentState = this.state.editorState.getCurrentContent();
        return stateToHTML(contentState);
    }

    setEditorContent(content){
        const rawEditorData = this.loadContent();
        if (rawEditorData !== null){
            const contentState = convertFromRaw(rawEditorData);
            const newEditorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState: newEditorState
            })
        }
    }
    


    render(){
        return(
            <>
                <form action="http://localhost:5000/rich" method="POST">

                    <input id="hiddenForm" name="hiddenForm"></input>
                    <input id="nameInput" name="fileName" placeholder='-- Page Title --'></input>
                    <h5>(The page title will show as the index link for the page)</h5>

             
                    <div id="buttonsDiv">
                        <button type="button" onClick={()=>this.handleKeyCommand("bold")}><i className="fa-solid fa-bold xl"></i></button>
                        <button type="button" onClick={()=>this.handleKeyCommand("italic")}><i className="fa-solid fa-italic"></i></button>
                        <button type="button" onClick={()=>this.handleKeyCommand("underline")}><i className="fa-solid fa-underline"></i></button>
                        <button type="button" onClick={()=>this.handleKeyCommand("code")}><i className="fa-solid fa-code"></i></button>
                    </div>

                <div id="editorDiv">
                    
                    <div style={{height: 'inherit'}}>
                        <Editor 
                            style={{height: 'inherit'}}
                            editorState={this.state.editorState} 
                            onChange={this.onChange} 
                            handleKeyCommand={this.handleKeyCommand.bind(this)}
                            placeholder="Type out your text body here"
                            />

                    </div>


                </div>
                {/* <DisplayEditor currentState={this.gettoHTML()}/> <br /> */}
                <button onClick={this.saveContent}>Save</button> <br />
                </form>
                

            </>
        )
    }
}


export default MyEditor;