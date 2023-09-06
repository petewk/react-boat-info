import React, { useEffect, useState, useMemo } from 'react';


function IndexItem(props){

    const name = props.name


    return (
        <h5 className="indexLink" filename={name} key={name} >{name.slice(0, -5).replaceAll('-', " ")}</h5>
    )
}


export default IndexItem;