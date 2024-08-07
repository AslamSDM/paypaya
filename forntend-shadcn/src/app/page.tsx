"use client";

import Image from "next/image";
import Connect from "@/components/Connect";
import GetStarted from "@/components/GetStarted";
import Login from "@/components/Login";
import VerifyOTP from "@/components/VerifyOTP";
import Wallet from "@/components/Wallet";

import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'localhost:3000',
  siweUri: 'http://localhost:3000/',
};

export default function Home() {
  return (
    // <GetStarted />
    <AuthKitProvider config={config}>
      <Connect />
    </AuthKitProvider>
    // <Login />
    // <VerifyOTP />
    // <Wallet />
    // <WorldIDVerify />
  );
}
