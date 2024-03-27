"use client";
import React, { useEffect, useState } from "react";
import getOauthURL from "@/utils/getOauthURL";

import { useRouter } from "next/navigation";

interface Props {}

const Home: React.FC<Props> = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const [googleOauthURL, setGoogleOauthURL] = useState<string>("");

  useEffect(() => {
    setGoogleOauthURL(getOauthURL());
  }, []);

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      console.log("[+]Code", code);
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions/oauth/google?code=${code}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("[+]Google signin in log ", res);

          if (!res.error) {
            localStorage.setItem(
              "userData",
              `${res.user.email}:${res.user.name}:${res.user._id}`
            );
            router.push("/dashboard");
          }
        });
    }
  }

  function loginHandler(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Simple validation for email and password
    if (!email.includes("@")) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    } else {
      setPasswordError("");
    }

    // Proceed with login functionality
    console.log("Login clicked");
    console.log(email, password);

    //post request to server

    fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/user/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log("[+] Login response ", res);
        if (res.error) {
          setLoginError(res.message || "Login failed");
        } else {
          setLoginError("");
          //login success
          localStorage.setItem(
            "userData",
            `${res.userData.email}:${res.userData.name}:${res.userData._id}`
          );
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("[!] Error:", error);
      });

    setEmail("");
    setPassword("");
  }

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value);
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(e.target.value);
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Welcome to our Login Page
        </h1>
        <form onSubmit={loginHandler}>
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
          {loginError && <p className="text-red-500 mt-4">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-md hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
        <button className="w-full mt-4 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700">
          <a href={googleOauthURL}>Sign in with Google</a>
        </button>
      </div>
    </div>
  );
};

export default Home;
