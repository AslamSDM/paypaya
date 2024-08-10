"use client";
import Wallet from "@/components/Wallet";
import { useEffect, useState } from "react";
import { getWallet } from "@/lib/localStorage"
import useOnlineStatus from "@/lib/onLineStatus"
import Offline from "@/components/Offline";
import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter()

  const [isSignedIn, setIsSignedin] = useState<boolean>(false);
  const online = useOnlineStatus();

  console.log(online)

  useEffect(() => {
    const w = getWallet();
    if (w.isLogined) setIsSignedin(true);
    if (!w.isLogined) router.push('login');
  }, []);

  return (
    <>
      {isSignedIn && online &&
        <Wallet />
      }
      {isSignedIn && !online &&
        <Offline />
      }
    </>
  );
}
