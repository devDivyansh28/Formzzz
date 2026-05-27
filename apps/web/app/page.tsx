"use client"
import { getUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default  function Home() {
  const router = useRouter()
  const { userInfo, isLoading, isError } = getUser();

 useEffect( ()=>{
   if (isLoading) return;

   if (userInfo && userInfo.id) {
     router.replace("/dashboard");
   } else {
     router.replace("/login");
   }
 },[userInfo , isError, isLoading, router]
 )
 

  return (
    
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h2 className="text-muted-foreground text-sm">Loading your workspace...</h2>
      </div>
    </main>
  );
}
