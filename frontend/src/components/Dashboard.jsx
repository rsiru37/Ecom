import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import Card from "./Card"
import { Modal, Button, Form, Table } from 'react-bootstrap';

export const Dashboard = () => {
    const [user, setuser] = useState();
    const [username, setusername] = useState();
    const [products, setproducts] = useState([]);
    const [qty, seteqty] = useState('');
    const [orders, setorders] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function mounting() {
            const user = await axios.get("http://localhost:3000/user", { withCredentials:true });
            setuser(user.data.user);
            setusername(user.data.user.username);
            const res = await axios.get("http://localhost:3000/products",{ withCredentials:true });
            setproducts(res.data.products);
            const orders = await axios.get("http://localhost:3000/orders",{ withCredentials:true });
            setorders(orders.data.orders);
        }   
        mounting();
    },[]);

    return(
        <div>
            <h1 style={{marginTop:'20px', textAlign:'center'}}>Shopee Customer Home Page</h1>
            <button 
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',}} onClick={async()  => {await axios.post("http://localhost:3000/logout", {}, {withCredentials:true}); navigate("/signin")}}>Logout</button>
            <h1>Welcome {username}</h1>
                <br></br>
                <h2> Products : </h2>
            {products.length == 0 ? <h5>No Products Yet!</h5> : (<div style=
                {{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '20px',
                }}
                >
            {products.map((product) => (
                <Card product={product} user={user}/>
            ))}
            </div>)}
            <br></br>
            <h1> Your Orders: </h1>
            {orders.length == 0 ? <h5>No Orders Yet!</h5> :
                (<div className="container mt-4">
                    <h2>Orders Table</h2>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.Products.name}</td>
                            <td>{order.purchased_quantity}</td>
                            <td>{order.Products.price}</td> {/* Assuming price is in cents */}
                            <td>{order.status}</td>
                        </tr>
          ))}
                      </tbody>
                    </Table>
                  </div>)}
        </div>
    )
}

// {orders.map(order => (
//     <tr key={order.order_id}>
//       <td>{order.order_id}</td>
//       <td>{order.product_name}</td>
//       <td>{order.quantity}</td>
//       <td>{}</td> {/* Assuming price is in cents */}
//       <td>{order.status}</td>
//     </tr>
//   ))}