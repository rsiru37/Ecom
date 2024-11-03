import { useState } from "react"
import axios from "axios"
// require('dotenv').config();
export const Signup = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState('ADMIN');
    const [error, setError] = useState(null);

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
                const res = await axios.post(`http://localhost:3000/signup`, {
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
         </p>
    </div>
}