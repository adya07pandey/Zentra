import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (

    <div className="landingpage">

      <div className="landingnavbar">
        <div className="logobox">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="landingnavbtn">
          <button className="signupnavbtn" onClick={()=>{navigate("../signup")}}>Singup</button>
          <button className="loginnavbtn" onClick={()=>{navigate("../login")}}>Login</button>
        </div>
      </div>
      <div className="titles">
        <h1>Modern Financial Dashboard for Smart Businesses</h1>
        <h3>Track transactions, manage accounts, and gain real-time financial insights <br /> with a powerful and secure backend system</h3>
        <button onClick={()=>{navigate("../signup")}}>Get Started</button>

      </div>

    </div>

  );
}