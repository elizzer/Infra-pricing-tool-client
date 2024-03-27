"use client";

import React, { useState, useEffect } from "react";
import getOauthURL from "@/utils/getOauthURL";
import { useRouter } from "next/navigation";

interface Props {}

const Register: React.FC<Props> = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [googleOauthURL, setGoogleOauthURL] = useState<string>("");

  useEffect(() => {
    setGoogleOauthURL(getOauthURL());
  }, []);

  function registerHandler(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Simple validation for email, name, and password
    if (!email.includes("@")) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }
    if (name.trim() === "") {
      setNameError("Name is required");
      return;
    } else {
      setNameError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    } else {
      setPasswordError("");
    }

    // Proceed with registration functionality
    console.log("Register clicked");
    console.log(email, name, password);
    setEmail("");
    setName("");
    setPassword("");

    //post request to server
    const userData = {
      email: email,
      name: name,
      password: password,
    };
    fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/user/auth/register`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("[+]Register response ", res);
        if (!res.error) {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem(
              "userData",
              `${res.user.email}:${res.user.name}`
            );
          }
          router.push("/dashboard");
        }
      });
  }

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  function nameHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value);
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(e.target.value);
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Register
        </h1>
        <form onSubmit={registerHandler}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-semibold mb-2 text-black"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              onChange={emailHandler}
              value={email}
              className={`w-full text-black bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                emailError ? "border-red-500" : ""
              }`}
            />
            {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-semibold mb-2 text-black"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              onChange={nameHandler}
              value={name}
              className={`w-full text-black bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                nameError ? "border-red-500" : ""
              }`}
            />
            {nameError && <p className="text-red-500 mt-1">{nameError}</p>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-semibold mb-2 text-black"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              onChange={passwordHandler}
              value={password}
              className={`w-full text-black bg-gray-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                passwordError ? "border-red-500" : ""
              }`}
            />
            {passwordError && (
              <p className="text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-md hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            Register
          </button>

          <button className="w-full mt-4 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700">
            <a href={googleOauthURL}>Sign in with Google</a>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
