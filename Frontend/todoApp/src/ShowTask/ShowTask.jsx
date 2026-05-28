import { useEffect, useState } from 'react'
import './ShowTask.css'

export function ShowTask(props) {
    const [task, setTasks] = useState([]);
    // const [status, setStatus] = useState(true);

    const updateList = (z) => {
        props.setTemp(z);
    }

    const deleteList = (id) => {
        fetch(`https://todo-app-f0gm.onrender.com/${id}`,{
            method: "DELETE",
        })
        .then(()=>{
            // alert("Deleted Successfully");
            props.setStatus(!(props.status));
        })
        .catch(errror => {
            console.log(error);  
        })
    }

    useEffect(function () {
        //getList Api call
        fetch("https://todo-app-f0gm.onrender.com/getList", {
            method: "GET",
            headers: { "content-type": "application/json",
                 'authorization': `Bearer ${localStorage.getItem("token")}`
             },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                setTasks(data);
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [props.status])


 


    return (
        <>
            <div className='container showcontainer'>
                <h2 className='title'>Show works</h2>
                <div className='taskList'>
                    {
                        task.map((item, i) => {
                            return (
                                <div className='task'>
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                    {/* <p>{item._id}</p> */}
                                    <div>

                                        <button className='btn btn1' onClick={() => updateList(item)}>Edit</button>
                                        <button className='btn btn2' onClick={() => deleteList(item._id)}>Delete</button>
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>

            </div>
        </>
    )
}