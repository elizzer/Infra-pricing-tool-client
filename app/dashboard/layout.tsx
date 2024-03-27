'use client'

import TopBar from "./topBar"
import SideBar from "./sideBar"
import { useRouter } from "next/navigation"

export default function Layout({children}:any){
    const router=useRouter()
    if (typeof localStorage !== "undefined") {

    if(!localStorage.getItem('userData')){
        router.push("/auth/login")
    }}
    return(
        <div className="flex h-screen w-screen bg-white">
            <SideBar />
            <div className="flex flex-col flex-1 bg-white">
                <TopBar />
                <div>{children}</div>
            </div>
        </div>
    )
}