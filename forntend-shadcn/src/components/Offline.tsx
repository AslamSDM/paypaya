"use client";
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input';


const Offline = () => {
    const [to, setTo] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        if (to != "" && amount != "") {
            const d = JSON.stringify({
                to: to,
                amount: amount
            })
            setSrc(`sms:+919876543210?body=${btoa(d)}`);
        } else {
            setSrc(undefined);
        }
    }, [to, amount])

    console.log(src)

    return (
        <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
                <div className="text-white text-[2em] font-bold my-[40px]">Offline Transfer 📧</div>
                <div className="flex flex-col w-[70%] gap-[20px]">
                    <div className="flex flex-col gap-[10px]">
                        <label className="text-[#ffffffb3] text-[0.8em]">To</label>
                        <Input className="bg-transparent text-white" type="text" placeholder='to' value={to} onInput={(e) => setTo((e.target as HTMLInputElement).value)} />
                    </div>
                    <div className="flex flex-col gap-[10px]">
                        <label className="text-[#ffffffb3] text-[0.8em]">Number</label>
                        <Input className="bg-transparent text-white" type="text" placeholder='amount' value={amount} onInput={(e) => setAmount((e.target as HTMLInputElement).value)} />
                    </div>
                    <div className="flex relative w-full justify-center">
                        <a className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer" href={src} onClick={() => { if (!src) event?.preventDefault() }} >
                            Send via SMS
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Offline