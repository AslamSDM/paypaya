"use client";
import { FC, useState } from "react";
import QRCode from "react-qr-code";

const shortAddress = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-5)}`

const data = {
    address: "0x838022424e339deC8f4EF15886e360ccA5ad992A",
    native: {
        symbol: "ETH",
        balance: 0.0067,
        usdValue: 18.37
    }
}


const Wallet: FC = () => {

    const [showQr, setShowQr] = useState<Boolean>(false);

    return (
        <div className="flex flex-col justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] text-white pb-[40px]">
                <div className="flex items-center">
                    <div className="flex justify-around items-center bg-[#c4c4c417] px-[10px] rounded-b-[5px]">
                        <div className="text-[1.em]">{shortAddress(data.address)}</div>
                        <div className="p-[6px]">
                            <img className="h-[25px] cursor-pointer" onClick={() => { navigator.clipboard.writeText(data.address) }} src="/copy.svg" alt="" />
                        </div>

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
                {showQr &&
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
            </div>
        </div>
    )
}

export default Wallet;