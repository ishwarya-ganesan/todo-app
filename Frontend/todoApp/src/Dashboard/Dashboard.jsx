import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

export default function Dashboard() {
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

   


    const handleLogin = (e) => {

        e.preventDefault();

        // fetch("http://localhost:5000/signIn", {
        fetch("https://todo-app-f0gm.onrender.com/signIn",{
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(userLogin)
        })
            .then((res) => {
                console.log(res);
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);
                localStorage.setItem("token", data.token);
                console.log(localStorage.getItem("token"));
                alert("signIn Successfully");
                navigate("/create-task");
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (
        <>
            <div className='dashboardContainer'>
                <h1>ToDo</h1>
                <form action="" className='signInForm'>
                    <label>Enter Your Email</label><input type="email" value={userLogin.email} onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })} /><br />
                    <label>Enter Your Password</label><input type="password" value={userLogin.password} onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })} />
                    <div className="dashboardBtn">
                        <button onClick={handleLogin}>Sign In</button>
                        <span>new to todoapp? <button onClick={()=>navigate("/signup")}>Sign Up</button></span>
                    </div>
                </form>
            </div>

        </>
    )
}