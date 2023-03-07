import React, {Component} from 'react';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw} from "draft-js";
import draftToHtml from 'draftjs-to-html';

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../App.css';

export default class WysiwygEditor extends Component {
    constructor(props){
        super(props);

    
        this.state={
            editorState: EditorState.createEmpty(),
        }

    }

    

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    render(){
        const {editorState} = this.state
        console.log(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())));


        return(
            <div>
                <Editor 
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'image', 'remove', 'history'],
                    inline: {
                        inDropdown: true,
                        options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        },
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        },
                    fontSize: {
                        icon: '',
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        },
                    textAlign: {
                        inDropdown: true
                    }
                     }}
                    editorstate={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName='wrapperClassName'
                    editorClassName='editorClassName'
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        )
    }
}