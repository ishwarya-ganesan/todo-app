import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css'
import { useState } from 'react';
export default function Signup() {
    
    const [signupDetails , setSignupDetails] = useState({
        name : "",
        email : "",
        password : "",
    })
    const navigate = useNavigate();
     const handleSignup = (e) => {
        e.preventDefault();

        fetch("https://todo-app-f0gm.onrender.com/signUp", {
        
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(signupDetails)
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);
                alert("SignUp Successfully");
                navigate("/signin");
            })
            .catch((error) => {
                console.log(error);     
            })

    }


    return (
        <>
            <div className="signup_overallDiv">
                
                <div className="signup_container">
                    <div className="leftDiv">
                        <h1>Welcome To TodoApp</h1>
                        <p>Already have an account?</p>
                        <button className='signup signinBtn' onClick={() => navigate("/signin")}>SIGN IN</button>
                    </div>
                    <div className="rightDiv">
                        <h1>Create Account</h1>
                        <form action="" className='signup_form'>
                            <input className='signup_input' type="text" placeholder="Name" onChange={e=>setSignupDetails({...signupDetails,name : e.target.value})}/>                                              
                            <input className='signup_input' type="email" placeholder="Email" onChange={e=> setSignupDetails({...signupDetails,email : e.target.value})} />
                            <input className='signup_input' type="text" placeholder="Password" onChange={e=>setSignupDetails({...signupDetails,password : e.target.value})}/>
                            <button className='signup signupBtn' onClick={handleSignup}>SIGN UP</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}