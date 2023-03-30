import './tiptap.scss'


import { Color } from '@tiptap/extension-color'
import Bold from '@tiptap/extension-bold';
import Paragraph from '@tiptap/extension-paragraph';
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import {Underline} from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { generateHTML } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';







const MenuBar = ({ editor }) => {

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', 'https://')

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }
  




  return (
    <div id="editorToolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <i className="fa-solid fa-bold"></i>
      </button>
      <button 
        onClick={()=> editor.chain().focus().toggleUnderline().run()}
        disabled={
            !editor.can()
                .chain()
                .focus()
                .toggleUnderline()
                .run()
        }
      >
        <i className="fa-solid fa-underline"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <i className="fa-solid fa-italic"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
       H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
       H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <i className="fa-solid fa-list-ul"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <i className="fa-solid fa-list-ol"></i>
      </button>
       <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
       <i className="fa-solid fa-link"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <i className="fa-solid fa-link-slash"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <i className="fa-solid fa-rotate-left"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <i className="fa-solid fa-rotate-right"></i>
      </button>
      <button onClick={addImage}><i className="fa-regular fa-image"></i></button>
    </div>
  )
}

const EntryPage = () => {

  const [contentState, setContentState] = useState();
  const [pageTitle, setPageTitle] = useState();
  const [category, setCategory] = useState();

  useEffect(()=>{
    setPageTitle(window.localStorage.getItem("editorFileName"));
    setContentState(window.localStorage.getItem("editorTextBody"));
    setCategory(window.localStorage.getItem("category"));
    });

  const editor = useEditor({
    extensions: [
    Underline,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      Link.configure({
        openOnClick: true,
      }),
      Image,
      Dropcursor,
    ],
    content: window.localStorage.getItem("editorTextBody"),



    

    onUpdate({editor}){
        setContentState(editor.getJSON());
        const input = document.getElementById("hiddenForm");
        input.value = JSON.stringify(editor.getJSON());

        

    },

    
   
  });



  return (
    <div>
        <form id='mainSubmit' action="http://localhost:5000/rich" method="POST">
            <input className="createFormInput" name="authCode" id="authCodeInput"  placeholder='Enter auth code here' type="number" required></input>
            <h5>This will be needed to save the page</h5>

            <input className="createFormInput" id="fileNameInputEdit" placeholder='Set File Name Here' defaultValue={pageTitle} name="fileName"></input>
            
            <div id="tooltip">Keeping the file name the same will overwrite the existing file with the same name. <br/>
              Changing the file name will create a seperate page with the content below
            </div>

            <input  id="hiddenForm" className="hiddenForm" name="hiddenForm"></input> <br />
            <input id="hiddenDir" name="category" className="hiddenForm" value={category}/>

            <button>Click to submit file</button>

        </form>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />

    </div>
  )
}

export default EntryPage;