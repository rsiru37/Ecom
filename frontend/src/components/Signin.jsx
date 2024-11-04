import { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from "../config"

export const Signin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    return <div>
        <h1> Welcome to Shopee</h1>
        <h2> SignIn Page</h2>
        <input onChange={(e) => {
            setUsername(e.target.value);
        }} type="text" placeholder="username" /><br></br><br></br>
        <input onChange={(e) => {
            setPassword(e.target.value);
        }} type="password" placeholder="password" /><br></br>

        <button onClick={async () => {
            try {
                const res = await axios.post(`${BACKEND_URL}/signin`, {
                    username,
                    password,
                },{ withCredentials:true });

                if(res.status == 200){
                    navigate('/dashboard')
                }
                if(res.status == 201){
                    navigate('/admin-board')
                }
                
            } catch (error) {
                console.log(error);
                alert(`${error}`);
            }
        }}>LOG IN</button>
        <p className="text-sm text-muted-foreground">
           <a href="/signup" className="underline">Goto Sign Up</a>
         </p>
        <div className="text-bottom" style={{
        position: 'absolute',
        bottom: '220px', // Distance from the bottom
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color:"red"
      }}>Default Credentials : 
      username:cust1,pwd:cust1 FREE CUSTOMER<br></br>
      username:cust2,pwd:cust2 PAID CUSTOMER<br></br>
      username:admin1,pwd:admin1 ADMIN
      </div>
    </div>
}