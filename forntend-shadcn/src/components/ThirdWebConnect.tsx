"use client";
import React from 'react'
import { ConnectButton, ConnectEmbed } from "thirdweb/react";
import { client } from "@/lib/thirdwebclient";
import { useConnectModal } from "thirdweb/react";

const ThirdWebConnect = () => {

    const { connect, isConnecting } = useConnectModal();

    async function handleConnect() {
        const wallet = await connect({ client }); // opens the connect modal
        console.log("connected to", wallet);
    }

    return (
        // <ConnectEmbed
        //     client={client}
        //     appMetadata={{
        //         name: "Example App",
        //         url: "https://example.com",
        //     }}
        // />

        <div className="flex items-center w-[70%] p-[10px] rounded-[5px] gap-[15px] px-[20px] border border-[#ffffff1f] bg-[#ffffff05] hover:bg-[#ffffff1f] cursor-pointer" onClick={handleConnect}>
            <div className="flex justify-center items-center">
                <img className="h-[30px] rounded-sm" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZaVpfhv3kgZA46GoqfVNIFhR6pXIdX4_Rg&s" alt="Wallet" />
            </div>
            <div className="text-white font-semibold">Conncet with any EVM Wallet</div>
        </div>
    )
}

export default ThirdWebConnect