### ECOMM - A Basic E-Commerce Web Application

## Local Setup for Backend
1. Setting up the Backend firstly after cloning the repository navigate to the backend folder
2. You can follow the .env.example file and populate the environment variables(DATABASE_URL,DIRECT_URL,JWT_SECRET,STRIPE_KEY,BACKEND_URL,FRONTEND_URL)
3. Deployed BACKEND_URL in this case is `https://ecom-backend-02va.onrender.com` (PRODUCTION)
4. Deployed FRONTEND_URL in this case is `https://ecom-tawny-three.vercel.app` (PRODUCTION) modify accordingly for local development
5. run `npm install`
6. run `node ./src/index.js` to start it locally
7. NOTE : You must populate the environment variables for smooth running of the project locally, I have used PostgreDB and you can fetch yours from supabase

## Local Setup for Frontend
1.Navigate to the Frontend Folder and run `npm install`
2. Run `npm run dev` to start it locally
