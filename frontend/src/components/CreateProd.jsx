import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios"
import { BACKEND_URL } from '../config';

export const CreateProd = ({isOpen, onClose}) => {
    const [users, setusers] = useState([]);
    const visibilityOptions=["FREE", "PAID"];
    useEffect(() => {
        async function fetchusers(){
            const users = await axios.get(`${BACKEND_URL}/user`, {withCredentials:true});
            if(users.status == 200){
                setusers(users.data.users);
            }
        }
        fetchusers();
    },[]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility:'',
        price: '',
        stock_availability: ""
      });

    const handleSave = async() => {
      if(formData.name=="" || formData.description=="" || formData.price=="" || formData.stock_availability=="" || formData.visibility==""){
        alert("Please fill in all the fields before submitting!");
      }
      else{
        try {
            const res = await axios.post(`${BACKEND_URL}/createprod`,{formData}, {withCredentials:true});
            if(res.status == 200){
                onClose();
                window.location.reload();
            }
        } catch (error) {
            res.status(500).json({error});
        }
      }
    alert("Saved!");
    }
    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    const handleSubmit = (e) => {
        e.preventDefault();
      };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>Create a New Task</Modal.Title>
                <Button variant="secondary" onClick={onClose} style={{ marginLeft: 'auto' }}> Close</Button>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                    type="text"
                    name="name"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Product title"
                    />
                </Form.Group>

                <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Product description"
        />
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label> Price in INR </Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        >
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="stock_availability">
        <Form.Label>Available Stock</Form.Label>
        <Form.Control
          type="number"
          name="stock_availability"
          value={formData.stock_availability}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="visibility">
        <Form.Label>Visibility</Form.Label>
        <Form.Control
          as="select"
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
        >
          <option value="">Select Visibility</option>
          {visibilityOptions.map((visibility) => (
            <option value={visibility}>{visibility}</option>
          ))}
        </Form.Control>
      </Form.Group>
      </Form>
            </Modal.Body>
      <Button variant="primary" onClick={handleSave}>Save Changes</Button>
    </Modal>
    )
} 