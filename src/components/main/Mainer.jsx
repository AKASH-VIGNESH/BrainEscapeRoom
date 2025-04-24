import headerImg from "../Assests/header.png";
import eclipse from "../Assests/Ellipse11.png";
import { useNavigate } from "react-router-dom";
import './Mainstyle.css';
import { useEffect } from 'react';

function Mainer() {
  useEffect(() => {

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
          window.location.href = "about:blank"; // Redirect to a blank page
      }
  });
  

    if (!localStorage.getItem("level")) {
      localStorage.setItem("level", "1");
    }
  }, [])


  useEffect(() => {
    const handleUnload = () => {
      localStorage.clear(); // Clears localStorage when the tab is closed
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  let navigate = useNavigate();

  let gate1 = () => {

    let pass = prompt("Enter the passkey:");
    let key = localStorage.getItem('level');
    if ('gate1' === pass && key==="1") {
      navigate('/wordle')
    }
  };

  let gate2 = () => {

    let pass = prompt("Enter the passkey:");
    let key = localStorage.getItem('level');
    if ('gate2' === pass && key === "2") {
      navigate('/mathler');
    }
  };

  let gate3 = () => {

    let pass = prompt("Enter the passkey:");
    let key = localStorage.getItem('level');
    if ('gate3' === pass && key === "3") {
      window.location.href = "https://neal.fun/password-game/";
    }
   
  };
  function handletie()
  {
    let x = prompt("Enter passkey:");
    if(x=='1021')
    {
      navigate('/tie');
    }
  }
  return (
    <>
      <div className="first-banner-home">
        <header>
          <img src={headerImg} alt="" className="headerImg" />
        </header>
        <nav className="home-nav">
          <h1 className="Br-title">Brain Escape room</h1>
          <p className="main-banner-subtitles">
            An Electrifying Competition Designed To Test Your Skils In Words, Math, and Deduction
          </p>
        </nav>
        <div className="main-content">
          <div id="gate1" className="gate gate1" onClick={gate1}>
            <span className="round-title">Round I</span>
            <h4 className="gate-head-content">Wordle</h4>
          </div>

          <div id="gate2" className="gate gate2" onClick={gate2}>
            <span className="round-title">Round II</span>
            <h4 className="gate-head-content">Mathler</h4>
          </div>

          <div id="gate3" className="gate gate3" onClick={gate3}>
            <span className="round-title">Round III</span>
            <h4 className="gate-head-content">password</h4>
          </div>

        </div>
        <div className="Eclipse">
          <img src={eclipse} className="backdrop-shadow"></img>
        </div>
      </div>
      <footer>
        <button onClick={()=>{handletie()}}>TieBreaker</button>
      </footer>
    </>
  );
}

export default Mainer;
