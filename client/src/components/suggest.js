import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../App.css';
import emailjs from '@emailjs/browser';

function SuggestPage(){
    
    const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    // emailjs.sendForm('gmail', 'template_ydhaxgp', form.current, 'user_heirvKnCxfrzglNjmpMqw')
    //   .then((result) => {
    //       console.log(result.text);
    //   }, (error) => {
    //       console.log(error.text);
    //   });

    document.getElementById('alertWindow').classList.toggle('fadeIn');


  };

    return(
        <>
            <div className="suggestPage">
                <h1>Make a suggestion</h1>
                <form ref={form} onSubmit={sendEmail}>
                    <input placeholder="Your name (Optional)" name="name"></input> <br />
                    <input type="email" placeholder="Email (Optional)" name="email"></input><br />
                    <textarea placeholder="What would you like to see?" name="suggestion" required></textarea><br />
                    <button type="submit">SEND</button>
                </form>
            </div>
            <div id="alertWindow">
                <div id="alertBox">
                    <h3>Thanks for the suggestion!</h3>
                </div>
            </div>
        </>

        
    )
}

export default SuggestPage;