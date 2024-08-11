"use client";

import { useState } from "react"
import { Input } from "@/components/ui/input"

const LoanInput = () => {

  const [lendAmount, setLendAmount] = useState<string>("");

  const handleLend = () => {
    // Handle Lend Here
  }

  return (
    <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
      <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
        <div className="text-white text-[2em] font-bold my-[40px]">Lend</div>
        <div className="flex flex-col w-[70%] gap-[20px]">

          <div className="flex flex-col gap-[5px]">
            <label className="text-[#ffffffb3] text-[0.8em]">Amount</label>
            <Input
              type="text"
              placeholder="10 USDC"
              className="bg-transparent text-white"
              value={lendAmount}
              onInput={(e) => { setLendAmount((e.target as HTMLInputElement).value) }}
            />
          </div>
        </div>
        <button
          className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer"
          onClick={handleLend}
        >
          Lend
        </button>
      </div>
    </div>
  );
}

export default LoanInput;