import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config';

export const Card = ({product, user}) => {
  const [range,setrange] = useState([]);
  const [selectedqty, setselectedqty] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    async function mounting(){
      setrange([...Array(product.stock_availability).keys(), product.stock_availability]);
    }
    mounting();
  },[]);
    const handlePay = async() => {
        const res = await axios.post(`${BACKEND_URL}/create-checkout-session`,{
          prod_id:product.id,
          prod_name:product.name,
          qty:selectedqty,
          price:product.price
        },{ withCredentials:true });
        if(res.status ==200){
          window.location.href = res.data.url;
        }
    }
    
    return(
        <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '10px',
      }}
    >{user.type == "PAID" || product.visibility == "FREE"? (<><h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>
      <div style={{ marginTop: '5px', fontSize: '14px' }}>
        <strong>Price:</strong> {product.price}/-
      </div>
      <div style={{ marginTop: '5px', fontSize: '14px' }}>
        <strong>Select Quantity:</strong>
        <select onChange={(e) => {setselectedqty(e.target.value)}}>
        {range.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
  </select>
      </div>
      <br></br>
    <button type="button" class="btn btn-primary" disabled={selectedqty==0} onClick={() => {handlePay()}}>BUY</button></>) : <h2>Paid Content</h2> }
      
    </div>
    )
}
export default Card;