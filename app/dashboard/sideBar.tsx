import { useRouter } from "next/navigation";

export default function SideBar() {
    const router=useRouter()
  return (
    <div className="flex flex-col items-center h-screen w-16 bg-gray-800 text-white">
      <div className="h-16 w-full flex items-center justify-center text-3xl">
        <span>=</span>
      </div>
      <div className="text-xl font-semibold">
        <button onClick={()=>{router.push("/dashboard")}}> A </button>
      </div>
    </div>
  );
}
