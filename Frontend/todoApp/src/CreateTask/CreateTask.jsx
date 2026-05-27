import { useEffect, useState } from 'react'
import { ShowTask } from '../ShowTask/ShowTask'
import './CreateTask.css'
import { useNavigate } from 'react-router-dom';

export default function CreateTask(props) {

    const navigate = useNavigate();
    const [temp, setTemp] = useState({
        title: "",
        description: ""
    });
    const [status, setStatus] = useState(true);
    const handleSignout = (e) => {
        localStorage.removeItem("token");
        navigate("/");
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!temp._id) {
            fetch("http://localhost:3005/addList", {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(temp)
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((data) => {
                    alert("Added Successfully");
                    setStatus(!status);
                    setTemp({ title: "", description: "" });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            fetch(`http://localhost:3005/updateList/${temp._id}`, {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(temp)
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((data) => {
                    // alert("updated Successfully");
                    setStatus(!status);
                    setTemp({ title: "", description: "" });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    return (
        <div className='createTask_overallDiv'>
            <button className='signoutBtn' onClick={handleSignout}>Sign out</button>
            <div className='createTask_container'>
                <div className="container">
                    <h2 className='title'>Create Work</h2>

                    <form className='taskForm' onSubmit={handleSubmit} >
                        <label>Title</label><br />
                        <input type="text" placeholder='Enter title' value={temp.title} onChange={(e) => setTemp({ ...temp, title: e.target.value })} /><br />
                        <label>Description</label><br />
                        <textarea rows="15" placeholder='Enter description' value={temp.description} onChange={(e) => setTemp({ ...temp, description: e.target.value })}></textarea>
                        <div>
                            <button className='btn'>{temp.title ? "Update" : "Create"}</button>
                        </div>
                    </form>

                </div>
                <ShowTask temp={temp} setTemp={setTemp} status={status} setStatus={setStatus} />
            </div>

        </div>


    )
}