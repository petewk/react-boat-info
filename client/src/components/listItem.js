import React, { useEffect, useState, useMemo } from 'react';


function IndexItem(props){

    const name = props.filename;


    return (
        <>
        {
            name.includes('.pdf') ?
            <h5 className="indexLink" filename={name} key={name} >{name.slice(0, -4).replaceAll('-', " ")}<i class="fa-regular fa-file-pdf searchMenuPDF"></i></h5>
            :

            <h5 className="indexLink" filename={name} key={name} >{name.slice(0, -5).replaceAll('-', " ")}</h5>
        }
        </>
    )
}


export default IndexItem;