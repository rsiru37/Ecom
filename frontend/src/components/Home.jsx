import React from 'react';

function Home() {
  return (
    <>
    <div className="container">
        <h1>Welcome to Shopee App</h1>
        <p className="text-sm text-muted-foreground">
        <a href="/signin" className="underline">Sign In</a>
         </p><br>
         </br>
         <p className="text-sm text-muted-foreground">
        <a href="/signup" className="underline">Sign Up</a>
         </p>
    </div>
    <div className="text-bottom" style={{
        position: 'absolute',
        bottom: '220px', // Distance from the bottom
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color:"red"
      }}>The Application was built keeping Backend/API/Functionalites in mind and not focussed towards the Frontend Styling/Aesthetics, the design part/UI/UX part could be made better by Frontend/UI Devs..</div>
    </>
  );
}

export default Home;