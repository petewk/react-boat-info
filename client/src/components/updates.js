import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, h2, NavLink, Link } from 'react-router-dom';
import '../App.css';


function UpdatesSection(props){

    const updatesRev = [...props.updates].reverse();


    function handleDate(date){
        return date.split('T')[0].split('-').reverse().join().replaceAll(',', '/')
    };

    function handleName(name){
        return name.replaceAll('-', ' ')
    }


    return (
        <div id="updatesContainer">
            <h3>Recent Updates:</h3>
            
            <div id="updatesHeaders"><b className="titleHeader">Page name:</b><b className="dateHeader">Date:</b><b className="byHeader">By:</b></div>
        {
            updatesRev.map((item, index)=>{
                    if (item.type === 'create'){
                        return (
                        <div className="updatesItem create" key={index}>
                            <h5 className="updatesTitle">{handleName(item.page_name)}</h5>
                            <h5 className="updatesDate">{handleDate(item.date)}</h5> <h5 className="updatesBy">{item.made_by}</h5>
                        </div>
                        )
                    } else if (item.type === 'edit'){
                        return (
                        <div className="updatesItem edit" key={index}>
                            <h5 className="updatesTitle">{handleName(item.page_name)}</h5>
                            <h5 className="updatesDate">{handleDate(item.date)}</h5> <h5 className="updatesBy">{item.made_by}</h5>
                        </div>
                        )
                    }  else {
                        return (
                        <div className="updatesItem pdf" key={index}>
                            <h5 className="updatesTitle">{handleName(item.page_name)}</h5>
                            <h5 className="updatesDate">{handleDate(item.date)}</h5> <h5 className="updatesBy">{item.made_by}</h5>
                        </div>
                        )
                    }
                })
        }
            <div id="updatesKey">New Page = <i class="fa-solid fa-square createSquare"></i>; New PDF = <i class="fa-solid fa-square pdfSquare"></i>; Page Edit = <i class="fa-solid fa-square editSquare"></i></div>
        
        </div>
    )

}


export default UpdatesSection;