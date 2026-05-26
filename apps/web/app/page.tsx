"use client"
import { getUser } from "~/hooks/api/auth";
import { api } from "~/trpc/server";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default  function Home() {
  const router = useRouter()
  const { userInfo } = getUser();

 useEffect( ()=>{
   if (userInfo && userInfo.id) {
     router.replace("/dashboard");
   } else {
     router.replace("/login");
   }
 },[userInfo , router]
 )
 

  return (
    
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h2> Server Message : {"Hello world"}</h2>
      </div>
    </main>
  );
}
