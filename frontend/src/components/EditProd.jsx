import React, { useEffect, useState } from 'react';
import axios from "axios"
import { Modal, Button, Form } from 'react-bootstrap';

export const EditProd = ({isOpen, onClose,product}) => {
    // const [startDate,setStartDate]=useState(new Date(2024,10,5));
    const [submitbutton,setsubmitbutton] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: '',
        price: '',
        stock_availability: '',
      });
      const [users,setusers] = useState([]);
      const visibilityOptions = ['FREE', 'PAID'];
    useEffect(() => {
        if (product) {
            setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            visibility: product.visibility || '',
            stock_availability:product.stock_availability || ''
          });
        }
      }, [product]);

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
        if(formData.name!="" && formData.description!="" && formData.due_date!=""){
          setsubmitbutton(true);
        }
        else{
          setsubmitbutton(false);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
      };

    const handleSave = async() => {
      if(formData.name=="" || formData.description=="" || formData.price=="" || formData.visibility=="" || formData.stock_availability==""){
        alert("Please fill in all the fields before submitting!");
      }
      else{
      try {
        const res = await axios.put(`http://localhost:3000/updateprod/?prod_id=${product.id}`,{formData}, {withCredentials:true});
        if(res.status == 200){
            onClose();
            window.location.reload();
        }
    } catch (error) {
        res.status(500).json({error});
    }
    }
  }
    return(
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>Edit Product</Modal.Title>
                <Button variant="secondary" onClick={onClose} style={{ marginLeft: 'auto' }}> Close</Button>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter title for the product"
                    />
                </Form.Group>

                <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description for the product"
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
          {visibilityOptions.map((visibility) => (
            <option value={visibility}>{visibility}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="price">
        <Form.Label>Price </Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        >
        </Form.Control>
      </Form.Group>


      <Form.Group controlId="stock_availability">
        <Form.Label>Stock Avaiable :</Form.Label>
        <Form.Control
          type="number"
          name="stock_availability"
          value={formData.stock_availability}
          onChange={handleChange}
        >
        </Form.Control>
      </Form.Group>
      </Form>
            </Modal.Body>
      <Button variant="primary" onClick={handleSave} disabled={!submitbutton}>Save Changes</Button>
    </Modal>

    )
}