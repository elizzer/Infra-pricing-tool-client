"use client";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // This code now runs on client side only
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      console.log("[+]params ", window.location.search);
      console.log("[+]params ", params.get("code"));
    }
  }, []); // The empty array ensures this effect runs only once after the initial render

  return <div>google page</div>;
}

//To-Do
// logout
// get the pricing data from AWS
//calculate the pricing in the backend before saving the inquiry into db
// TopBar and SideBar UI changes
// replace icons from characters
// create edit and delete inquiry
