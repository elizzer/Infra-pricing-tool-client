"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  let userData
  if (typeof localStorage !== "undefined") {

   userData = localStorage.getItem("userData")?.split(":");
  }
  const router = useRouter();

  function newEnquiry() {
    console.log("[+] create button");
    router.push("dashboard/new_enquiry");
  }

  function viewInquiries() {
    router.push("dashboard/list_enquiry");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <h2 className="text-2xl mb-4">Welcome back, {userData && userData[1]}</h2>
      <div className="text-black">
        <button
          onClick={newEnquiry}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-2"
        >
          Create a new enquiry
        </button>
        <button
          onClick={viewInquiries}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
        >
          View list of enquiries
        </button>
      </div>
    </div>
  );
}
