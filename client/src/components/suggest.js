import React, { useEffect, useState, useMemo, useRef } from 'react';
import '../App.css';
import emailjs from '@emailjs/browser';

function SuggestPage(){
    
    const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    console.log("sending")

    emailjs.sendForm('gmail', 'template_ydhaxgp', form.current, 'user_heirvKnCxfrzglNjmpMqw')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });

    
function successAlert(){
    const alertTarget = document.getElementById(alert);
    alertTarget.classList.add("alerting");
}


  };

//   return (
//     <form ref={form} onSubmit={sendEmail}>
//       <label>Name</label>
//       <input type="text" name="user_name" />
//       <label>Email</label>
//       <input type="email" name="user_email" />
//       <label>Message</label>
//       <textarea name="message" />
//       <input type="submit" value="Send" />
//     </form>
//   );

    return(
        <div className="suggestPage">
            <h1>Make a suggestion</h1>
            <form ref={form} onSubmit={sendEmail}>
                <input placeholder="Your name (Optional)" name="name"></input> <br />
                <input type="email" placeholder="Email (Optional)" name="email"></input><br />
                <textarea placeholder="What would you like to see?" name="suggestion" required></textarea><br />
                <button type="submit">SEND</button>
            </form>
            <div id="alert">
                <span></span>
            </div>
        </div>

        
    )
}

export default SuggestPage;