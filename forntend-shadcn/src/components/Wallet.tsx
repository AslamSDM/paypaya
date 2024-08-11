"use client";

import { FC, useState } from "react";
import QRCode from "react-qr-code";
import { INetwork, networks } from "@/lib/networks";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const shortAddress = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-5)}`

const data = {
    address: "0x838022424e339deC8f4EF15886e360ccA5ad992A",
    native: {
        symbol: "USDC",
        balance: 0.0067,
        usdValue: 18.37
    }
}

const Wallet: FC = () => {

    const router = useRouter()

    const [showQr, setShowQr] = useState<Boolean>(false);
    const [network, setNetwork] = useState<INetwork>(networks[0]);

    const handleCopy = () => {
        if (typeof window !== "undefined") navigator.clipboard.writeText(data.address)
    }

    const handleNetworkChange = (id: Number) => {
        const chain = networks.find(network => network.chainId === id);
        if (chain) setNetwork(chain);
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] text-white pb-[40px]">
                <div className="flex w-full items-center justify-around">
                    <div className=""></div>
                    <div className="flex justify-around items-center bg-[#c4c4c417] px-[10px] rounded-b-[5px]">
                        <div className="text-[1.em]">{shortAddress(data.address)}</div>
                        <div className="p-[6px]">
                            <img className="h-[25px] cursor-pointer" onClick={() => { handleCopy() }} src="/copy.svg" alt="" />
                        </div>
                    </div>
                    <div className="bg-[#ffffff10] px-[10px] py-[3px] rounded-sm">
                        <DropdownMenu>
                            <DropdownMenuTrigger>{network.name}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {
                                    networks.map((chain, i) => {
                                        return (
                                            <DropdownMenuItem key={i} onClick={() => { handleNetworkChange(chain.chainId) }}>{chain.name}</DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="flex flex-col items-center my-[40px]">
                    <div className="font-medium text-[2.5em] mb-[-5px]">
                        {data.native.balance} {data.native.symbol}
                    </div>
                    <div className="text-[#ffffff81] text-[1.3em]">
                        ${data.native.usdValue} USD
                    </div>
                </div>
                {!showQr &&
                    <div className="mb-[50px]">
                        <div className="bg-white p-4">
                            <QRCode value={data.address} />
                        </div>
                    </div>
                }
                <div className="flex w-[50%]">
                    <div className="flex justify-center text-white items-center px-[20px] py-[10px] w-[50%] bg-[#335fff] hover:bg-[#335fff89] rounded-l-[25px] font-bold text-[1.2em] cursor-pointer" onClick={() => { setShowQr(!showQr) }}>
                        Recieve
                    </div>
                    <div className="flex justify-center text-white items-center px-[20px] py-[10px] w-[50%] bg-[#335fff] hover:bg-[#335fff89] rounded-r-[25px] font-bold text-[1.2em] border-l border-l-[#fff] cursor-pointer">
                        Send
                    </div>
                </div>
                <div className="flex w-[50%] mt-[20px]">
                    <div className="flex justify-center w-full
                     text-white items-center px-[20px] py-[10px] bg-[#335fff] hover:bg-[#335fff89] rounded-[25px] font-bold text-[1.2em] cursor-pointer" onClick={() => { router.push('/loan') }}>
                        Loan
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet;