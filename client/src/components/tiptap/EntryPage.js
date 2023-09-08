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
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';







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
      {/* <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button> */}
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
      <button onClick={addImage}><i className="fa-solid fa-image"></i></button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <i class="fa-solid fa-table"></i>
      </button>
      <button className='tableButtons' onClick={() => editor.chain().focus().addColumnBefore().run()}>
        Column Before
      </button>
      <button className='tableButtons' onClick={() => editor.chain().focus().addColumnAfter().run()}>Column After</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().deleteColumn().run()}>Delete Column</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().addRowBefore().run()}>Row Before</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().addRowAfter().run()}>Row After</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().deleteRow().run()}>Delete Row</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</button>
      <button className='tableButtons' onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
        Header Column
      </button>
      <button className='tableButtons' onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
        Header Row
      </button>
      <button className='tableButtons' onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
        Header Cell
      </button>
    </div>
  )
}

const EntryPage = () => {

  const [contentState, setContentState] = useState();
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

  const editor = useEditor({
    extensions: [
    Table.configure({
        resizable: true,
      }),
    TableRow,
    TableHeader,
    TableCell,
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

    

    onUpdate({editor}){
        setContentState(editor.getJSON());
        const input = document.getElementById("hiddenForm");
        input.value = JSON.stringify(editor.getJSON());

        

    },
   
  });

  

  return (
    <div id="mainSubmitContainer">
        <form id='mainSubmit' action="/rich" method="POST">
            <input className="createFormInput" name="authCode" id="authCodeInput" placeholder='Enter auth code here' type="number" required></input>

            <input className="createFormInput" id="fileNameInput" placeholder='Page Title' name="fileName"></input> <br />

            <select name="category" id="categorySelect" required>
              <option disabled selected hidden>Please Choose a Category...</option>
              {
                categories.map((item, index)=>(
                  <option value={item}>{item[0].toUpperCase() + item.substring(1).replaceAll("-", " ")}</option>
                ))
              }
            </select>

            <input  id="hiddenForm" className="hiddenForm" name="hiddenForm"></input> <br />
            <input  id="hiddenFormtype" className="hiddenForm" name="hiddenFormtype" value="create"></input>

            <button><i class="fa-regular fa-floppy-disk"></i></button>
        </form>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />

    </div>
  )
}

export default EntryPage;