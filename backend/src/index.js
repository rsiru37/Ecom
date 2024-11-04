import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import { PrismaClient, role, type, status } from '@prisma/client'
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_KEY);

app.use(cookieParser());
app.use(cors({origin:"https://ecom-tawny-three.vercel.app", credentials:true}));

app.use(express.json());

app.post('/create-checkout-session', auth, async (req, res) => {
    const {prod_id, prod_name, price, qty } = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
            currency: 'inr',
            product_data: {
              name: prod_name,
            },
            unit_amount: Number(price)*100,
          },
        quantity: qty,
      },
    ],
    metadata:{
        product_id:prod_id
    },
    mode: 'payment',
    success_url: `${process.env.BACKEND_URL}/checkout?success=true&sid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BACKEND_URL}/checkout?canceled=true/`,
});
    res.status(200).json({ url: session.url });
  //res.redirect(303, session.url);
});

app.get("/checkout", auth, async(req,res) => {
    if(req.query.success == "true"){
        const {sid} = req.query;
        const checkout_session = await stripe.checkout.sessions.retrieve(sid, { expand: ['line_items'] });
        const prod_id = checkout_session.metadata.product_id;
        const order = await prisma.orders.create({
            data:{
                user_id:req.user.id,
                product_id:Number(checkout_session.metadata.product_id),
                status:status.PENDING,
                purchased_quantity:checkout_session.line_items.data[0].quantity
            }
        });
        const update_prod = await prisma.products.update(
            {
                where:{id:Number(prod_id)},
                data:{
                    stock_availability:
                    {
                        decrement: checkout_session.line_items.data[0].quantity,
                    },
                    }
            }
        );
        const html_success = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success!</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        .container {
            text-align: center;
            padding: 20px;
            border: 1px solid #4CAF50;
            background-color: #ffffff;
            border-radius: 8px;
        }
        h1 {
            color: #4CAF50;
        }
        p {
            font-size: 18px;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        a:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Success!</h1>
        <p>Your transaction was successful.</p>
        <p>Thank you for your purchase!</p>
        <a href="http://localhost:5173/dashboard"/>Go back to Homepage</a>
    </div>
</body>
</html>`
        res.send(html_success);
    }
    else if(req.query.canceled =="true"){
        const html_failed = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8d7da;
            color: #721c24;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        h1 {
            font-size: 2.5em;
            margin: 0;
        }
        p {
            font-size: 1.2em;
            margin: 20px 0;
        }
        a {
            text-decoration: none;
            color: #007bff;
            font-weight: bold;
        }
        .container {
            text-align: center;
            padding: 20px;
            border: 1px solid #f5c6cb;
            border-radius: 10px;
            background-color: #f8d7da;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Payment Failed</h1>
    <p>We're sorry, but your payment could not be processed.</p>
    <p>Please check your payment details or try again later.</p>
    <a href="/checkout">Return to Checkout</a>
</div>

</body>
</html>`
res.send(html_failed);
}


})

app.post("/signup", async(req,res) => {
    const {username, password, role} = req.body;
    const existing_user = await prisma.users.findFirst({where: {username:username}});
    if(existing_user){
        res.status(302).json({message:"User already exists try with a different username"});
    }
    else{
        const hashedPassword = await bcrypt.hash(password,10);
        try {
            const user = await prisma.users.create({
                data:{
                    username:username,
                    password:hashedPassword,
                    role:role,
                    type:type.FREE,
                }
            });
            res.status(200).json({message:"User Creation is Successfull!"});
        } catch (error) {
            res.status(500).json({error:error});
        }
    }
})

app.post("/signin", async(req,res) => {
    const {username, password} = req.body;
    const existing_user = await prisma.users.findFirst({where: {username:username}});
    if(existing_user){
        const passwordValidation = await bcrypt.compare(password, existing_user.password);
        if(passwordValidation){
            const token = jwt.sign({id:Number(existing_user.id)}, process.env.JWT_SECRET);
            res.cookie("token",token,{httpOnly: true,secure: true,sameSite: 'None'});
            if(existing_user.role == "CUSTOMER"){
                res.status(200).json({message:"Logged in as customer", token:token});
            }
            if(existing_user.role == "ADMIN"){
                res.status(201).json({message:"Logged in as admin", token:token});
            }
        }
        else{
            res.status(400).json({message:"Wrong Password"});
        }    
    }
    else{
        res.status(400).json({message:"Username doesn't exist"})
    }
})

async function auth(req,res,next) {
    console.log("REQ", req);
    console.log("-----REQ.COokies", req.cookies);
    const token = req.cookies.token;
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await prisma.users.findFirst({where: {id:req.user.id}});
        if(user.role == role.CUSTOMER){
            req.user.role = "CUSTOMER";
            next();
        }
        else if(user.role == role.ADMIN){
            req.user.role = "ADMIN";
            next();
        }
        else{
            res.status(402).send({message:"Something went wrong"});
            return;
        }
    }
    else {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

app.post("/createprod", auth, async(req,res) => {
    if(req.user.role == "ADMIN"){ // Only Admins can create!
        try {
            const {name, price, description, stock_availability,visibility} = req.body.formData;
            const product = await prisma.products.create({
                data:{
                name,
                price:Number(price),
                description,
                stock_availability:Number(stock_availability),
                visibility,
                created_admin:req.user.id
                }
            });
            res.status(200).json({message:"Product Creation Successful"});
        } catch (error) {
            res.status(500).json({error:error});
        }
    }
    else{
        res.status(402).json({message:"Not an Admin, Cannot Create!"});
    }
})

app.put("/updateprod", auth, async(req,res) => {
    const {prod_id} = req.query;
    const {name, price, description, stock_availability,visibility} = req.body.formData;
    const product = await prisma.products.findUnique({where:{id:Number(prod_id)}});
    if(req.user.role == "ADMIN" && product.created_admin == req.user.id && product){
        try {
            const product = await prisma.products.update({
                where:{id:Number(prod_id)},
                data:
                {
                    name,
                    price:Number(price),
                    description,
                    stock_availability:Number(stock_availability),
                    visibility
                }});
                res.status(200).json({message:"Task Updated!"});
        } catch (error) {
            res.status(500).json({message:error});
        }
    }
    else{
        res.status(402).json({message:"Cannot Update!"});
    }
})

app.put("/updateorder", auth, async(req,res) => {
    const {order_id, status} = req.query;
    const order = await prisma.orders.findUnique({where:{id:Number(order_id)}});
    if(req.user.role=="ADMIN" && order){
        try {
            const updated_order = await prisma.orders.update({where:{id:Number(order_id)}, data:{status:status}});
            res.status(200).json({message:"Order Update Done!"});
        } catch (error) {
            res.status(500).json({message:error});
        }
    }
    else{
        res.status(403).json({message:"Cannot update this role"});
    }
    }
)

app.get("/user", auth, async(req,res) => {
    const user_id = req.user.id;
    try {
        const user = await prisma.users.findUnique({where:{id:Number(user_id)}});
        if(user){
            res.status(200).json({user});
        }
        else{
            res.status(402).json({message:"User not Found"});
        }
    } catch (error) {
        res.status(500).json({message:error});
    }
});

app.get("/products", auth, async(req,res) => {
    try {
        const products = await prisma.products.findMany();
        res.status(200).json({products});
    } catch (error) {
        res.status(500).json({message:error});
    }
});

app.get("/orders", auth, async(req,res) => {
    try {
        if(req.user.role == "CUSTOMER"){
            const orders = await prisma.orders.findMany(
                {
                    where:{ user_id:req.user.id },
                    include: {
                        Products:{select: {name:true, price:true, created_admin:true}}
                    }
                }); // Fetching all the Orders for this user
            res.status(200).json({orders});
        }
        if(req.user.role == "ADMIN"){
            const orders = await prisma.orders.findMany({
                where: {Products: {created_admin: req.user.id}},
                include: {Products: {select:{name:true, price:true, created_admin:true}}}
              });    
                res.status(200).json({orders});
        }
    } catch (error) {
        res.status(500).json({message:error});
    }
})

app.post("/logout", auth, async(req,res) => {
    res.clearCookie("token");
    res.json({message: "Logged out!"});
})

app.listen(3000, () => { console.log("Backend Started!") });