import { useRouter } from "next/navigation";

export default function TopBar() {

    const router = useRouter()

    function logoutHandler(){
        localStorage.removeItem('userData')
        router.push('/auth/login')
    }

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
      <h1 className="text-xl font-bold">Infra Pricing Tool</h1>
      <div className="flex items-center space-x-4">
        <div className="mr-5">
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </div>
    </div>
  );
}
