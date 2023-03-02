import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, convertFromHTML } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import '../App.css';
import '../../node_modules/draft-js/dist/Draft.css';


class DisplayEditor extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            editorState: EditorState.createEmpty(),
            showPreview: false,
        };
        
        this.onChange = (editorState) => this.setState({editorState});
        this.loadContent = this.loadContent.bind(this);
        this.setEditorContent = this.setEditorContent.bind(this);
        this.contentAsHTML = this.contentAsHTML.bind(this);

    }

    loadContent(){
        const savedData = localStorage.getItem('draftEditorContent');
        return savedData ? JSON.parse(savedData) : null;
    }

    setEditorContent(){
        const rawEditorData = this.loadContent();
        if (rawEditorData !== null){
            const contentState = convertFromRaw(rawEditorData);
            const newEditorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState: newEditorState
            })
        } else {
            this.setState({ editorState: EditorState.createEmpty()})
        }
        const p = document.getElementById('checkHTML');
        this.setState({ showPreview: !this.state.showPreview})
    }

    contentAsHTML(){
        const contentState = this.state.editorState.getCurrentContent();
        const html = stateToHTML(contentState);
        console.log(convertFromRaw(contentState))
    }

    render(){
        return (
            <>
            <button onClick={this.setEditorContent}>Preview</button>
            {
                this.state.showPreview ? (
                    <>
                    <div id="displayDiv">
                
                        <Editor 
                            editorState={this.state.editorState} 
                            readOnly='true'
                        />
                    </div>
                    <p id="checkHTML">{this.contentAsHTML()}</p>
                    </>
                ) : (

                    null

                )
            }
            
            </>
        )
    };

};

export default DisplayEditor;