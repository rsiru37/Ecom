import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { EditProd } from './EditProd';
import { FaTrash } from 'react-icons/fa';


export const ACard = ({product, user}) => {
  const [range,setrange] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function mounting(){
      setrange([...Array(product.stock_availability).keys(), product.stock_availability]);
    }
    mounting();
  },[]);
    
    return(
        <div
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '10px',
      }}
    >
    <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>
      <div style={{ marginTop: '5px', fontSize: '14px' }}>
        <strong>Price:</strong> {product.price}/-
      </div>
      <div style={{ marginTop: '5px', fontSize: '14px' }}>
        <strong>Quantity:</strong>{product.stock_availability}
      </div>
      <div style={{ marginTop: '5px', fontSize: '14px' }}>
        <strong>Visibility:</strong>{product.visibility}
      </div>
      <br></br>
    <button type="button" class="btn btn-primary" onClick={() => {setShowModel(true)}}>EDIT</button> 
    {/* <div
          style={{
            position: 'absolute',
            bottom: '22px',
            right: '10px',
            cursor: 'pointer',
            color: 'red'
          }} onClick={onDelete}> <FaTrash size={15} /></div> */}
    <EditProd onClose={() => {setShowModel(false)}} isOpen={showModel} key={product.id} product={product}/>
    </div>
    )
}
export default ACard;