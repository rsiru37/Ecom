### ECOMM - A Basic E-Commerce Web Application

## Local Setup for Backend
1. Setting up the Backend firstly after cloning the repository navigate to the backend folder
2. You can follow the .env.example file and populate the environment variables(DATABASE_URL,DIRECT_URL,JWT_SECRET,STRIPE_KEY,BACKEND_URL,FRONTEND_URL)
3. Deployed BACKEND_URL in this case is `https://ecom-backend-02va.onrender.com` (PRODUCTION)
4. Deployed FRONTEND_URL in this case is `https://ecom-tawny-three.vercel.app` (PRODUCTION) modify accordingly for local development
5. run `npx migrate dev` to run the migrations on your loca; postgres db
6. run `npm install`
7. run `node ./src/index.js` to start it locally
8. NOTE : You must populate the environment variables for smooth running of the project locally, I have used PostgreDB and you can fetch yours from supabase

## Local Setup for Frontend
1. Navigate to the Frontend Folder and run `npm install`
2. Navigate to the config file and update the BACKEND_URL with your BACKEND_URL for it to work smoothly
3. Run `npm run dev` to start it locally
