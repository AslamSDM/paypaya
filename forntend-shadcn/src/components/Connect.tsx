"use client";
import FarcasterVerifyBtn from "./FarcasterVerifyBtn";
import ThirdWebConnect from "./ThirdWebConnect";
import WorldIDVerifyBtn from "./WorldIDVerifyBtn";
import BackButton from "./BackButton"

const Connect = () => {
  return (
    <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
      <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[30px] relative">
        <div className="absolute top-[20px] left-[20px]">
          <BackButton />
        </div>
        <div className="text-white text-[2em] font-bold my-[40px]">Connect</div>
        <div className="flex flex-col items-center w-[70%] gap-[20px]">
          <WorldIDVerifyBtn />
          <FarcasterVerifyBtn />
        </div>
        <div className="text-[#ffffff68] text-sm my-[20px]">OR</div>
        <ThirdWebConnect />

      </div>
    </div>
  )
}

export default Connect;