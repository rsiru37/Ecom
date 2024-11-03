import { useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

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
                const res = await axios.post(`http://localhost:3000/signin`, {
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
                alert(`${error.response.data.message}`);
            }
        }}>LOG IN</button>
    </div>
}