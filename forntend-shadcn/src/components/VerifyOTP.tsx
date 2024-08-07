"use client";
import { useState } from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyOTP = () => {

  const [otp, setOTP] = useState<string>("");

  return (
    <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
      <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
        <div className="text-white text-[2em] font-bold mt-[40px]">Verify OTP</div>
        <div className="text-[#ffffff86] text-sm my-[30px]">Please enter the OTP sent to your phone.</div>
        <div className="flex flex-col items-center w-[70%] gap-[20px]">
          <InputOTP maxLength={6} onComplete={(value) => { setOTP(value) }}>
            <InputOTPGroup className="text-white">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="text-white"/>
            <InputOTPGroup className="text-white">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer">
          Verify
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP;