import { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from "../config"

export const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState('ADMIN');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleChange = (event) => {
        const value = event.target.value;
        setRole(value);
      };

    return <div>
        <h1> Welcome to Shopee</h1>
        <h2> SignUp Page</h2>
        <input onChange={(e) => {
            setUsername(e.target.value);
        }} type="text" placeholder="username" /><br></br><br></br>
        <input onChange={(e) => {
            setPassword(e.target.value);
        }} type="password" placeholder="password" /><br></br>

        <label>ROLE</label>
      <select value={role} onChange={handleChange}>
          <option value={"ADMIN"}>ADMIN</option>
          <option value={"CUSTOMER"}>CUSTOMER</option>
      </select>

        <button onClick={async () => {
            try {
                const res = await axios.post(`${BACKEND_URL}/signup`, {
                    username,
                    password,
                    role
                });
                if(res.status == 200){
                    alert("Signup successfull!");
                    setTimeout(() => {
                    navigate('/signin')
                    }, 1000)
                }
                
            } catch (error) {
                alert(`${error.response.data.message}`);
            }
        }}>Submit</button>
        <p className="text-sm text-muted-foreground">
           Already have an account? <a href="/signin" className="underline">Sign In</a>
         </p><br></br>
         <p style={{color:"blue"}}>Since the Backend is deployed on the Cloud, You might have to wait for around 60 seconds for the Backend Server to Start</p>
    </div>
}