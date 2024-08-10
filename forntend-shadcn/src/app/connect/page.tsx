"use client";
import Connect from "@/components/Connect";
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';

const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'localhost:3000',
    siweUri: 'http://localhost:3000/',
};

export default function Home() {

    return (
        <AuthKitProvider config={config}>
            <Connect />
        </AuthKitProvider>
    );
}
