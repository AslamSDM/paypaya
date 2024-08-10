"use client";
import GetStarted from "@/components/GetStarted";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'


export default function Home() {

  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {      
      router.push('/wallet');
    }, 2000)
  }, []);

  return (
    <>
      <GetStarted />
    </>
  );
}
