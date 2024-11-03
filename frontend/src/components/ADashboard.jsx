import { useEffect, useState } from "react"
import axios from "axios";
import { CreateProd } from "./CreateProd";
import { Modal, Button, Form, Table} from 'react-bootstrap';
import ACard from "./ACard";
import { useNavigate } from 'react-router-dom'

export const ADashboard = () => {
    const [user, setuser] = useState();
    const [username, setusername] = useState('');
    const [showModel, setShowModel] = useState(false);
    const [products, setproducts] = useState([]);
    const [orders, setorders] = useState([]);
    const [status,setstatus] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function mounting() {
            const user = await axios.get("http://localhost:3000/user", { withCredentials:true });
            setuser(user.data.user);
            setusername(user.data.user.username);
            const products = await axios.get("http://localhost:3000/products", { withCredentials:true });
            setproducts(products.data.products);
            const orders = await axios.get("http://localhost:3000/orders",{ withCredentials:true });
            setorders(orders.data.orders);
        }
    mounting();

},[]);
    const handleStatusChange = async(order_id,status) => {
        try {
          await axios.put(`http://localhost:3000/updateorder?order_id=${order_id}&status=${status}`,{},{withCredentials:true});
          window.location.reload();
        } catch (error) {
          alert(error);
        }

    }

    return(
        <div>
            <h1 style={{marginTop:'20px', textAlign:'center'}}>Shopee Admin Home Page</h1>
            <button 
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',}} onClick={async()  => {await axios.post("http://localhost:3000/logout", {}, {withCredentials:true}); navigate("/signin")}}>Logout
            </button>
            <h1>Welcome {username}</h1>
            <br></br>
            <CreateProd onClose={() => {setShowModel(false)}} isOpen={showModel}/>
            <button type="button" class="btn btn-success" onClick={() => {setShowModel(true)}}>Create Product</button>
            <br></br>
            <h2>My Products </h2>
            {products.length == 0 ? <h5>No Products Yet!</h5> : (<div style=
                {{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '20px',
                }}
                >
            {products.map((product) => (
                <ACard product={product} user={user}/>
            ))}
            </div>)}      
            <br></br><br></br>
            <h1>My Orders</h1>
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
                          <th>Update</th>
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
                            <td>
                <select
                  onChange={(e) => handleStatusChange(order.id,e.target.value)}
                  disabled={order.status === 'DELIVERED'}
                >
                  <option value="">Select the Status to Update</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                </select>
              </td>
                        </tr>
          ))}
                      </tbody>
                    </Table>
                  </div>)}
        </div>
    )
}