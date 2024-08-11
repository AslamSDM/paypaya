"use client";

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";

import Loader from "@/components/Loader"

const countryCodes = {
  India: "+91",
  US: "+1",
  Africa: "+231",
}

const countries = Object.keys(countryCodes);
const codes = Object.values(countryCodes);

const Login = () => {

  const [dialCode, setDialCode] = useState<string>("+91");
  const [phoneNo, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("")


  const [message, setMessage] = useState();

  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  const handleClick = async () => {
    //update supabase for email and phonenumber mapping
    // const message = await getMessage();
    openAuthModal()
    //update supabase for email and phonenumber mapping
  }

  const handleCopy = (e: { target: HTMLInputElement; }) => {
    if (typeof window !== "undefined") navigator.clipboard.writeText((e.target as HTMLInputElement).value);
  }

  useEffect(() => {
    if (user) {
      getMessage(user.address);
    }
  }, [])

  const getMessage = async (address: string) => {
    const response = await fetch('/api/phone/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address: address })
    }
    );
    const data = await response.json();
    console.log(data);
    setMessage(data.message);
  }

  return (
    <>
      {signerStatus.isInitializing ? (
        <Loader />
      ) : user ? (
        <>
          {/* <div className="flex flex-col gap-2 p-2">
            <p className="text-xl font-bold">Success!</p>
            You're logged in as {user.email ?? "anon"}.
            Youy wallet address is c
            <button
              className="btn btn-primary mt-6"
              onClick={() => logout()}
            >
              Log out
            </button>
            <button
              className="btn btn-primary mt-6"
              onClick={() => getMessage(user.address)}
            >
              verify
            </button>
          </div> */}

          <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
              <div className="text-white text-[2em] font-bold my-[40px]">Verify ✍🏻</div>
              <div className="text-[0.8em]">You are signed in as {user.email ?? "anon"}.</div>
              <div className="text-[0.8em]">Copy message and send to +91 9220592205 to confirm</div>
              <div className="">
                <Input type="text" value={message} disabled onClick={handleCopy} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[15px]">
              <div className="text-white text-[2em] font-bold my-[40px]">Setup Account ✍🏻</div>
              <div className="flex flex-col w-[70%] gap-[20px]">
                <div className="flex flex-col gap-[5px]">
                  <label className="text-[#ffffffb3] text-[0.8em]">Country</label>
                  <Select onValueChange={(value: string) => { setDialCode(value) }} value={dialCode}>
                    <SelectTrigger className="flex bg-transparent text-[#fff]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country, i) => (
                        <SelectItem key={i} value={codes[i]}>{`${country} (${codes[i]})`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-[5px]">
                  <label className="text-[#ffffffb3] text-[0.8em]">Number</label>
                  <Input
                    type="text"
                    placeholder="Enter Phone Number"
                    className="bg-transparent text-white"
                    onInput={(e) => { setPhoneNumber((e.target as HTMLInputElement).value) }}
                  />
                </div>
                <div className="flex flex-col gap-[5px]">
                  <label className="text-[#ffffffb3] text-[0.8em]">Email</label>
                  <Input
                    type="text"
                    placeholder="Enter Email Address"
                    className="bg-transparent text-white"
                    onInput={(e) => { setEmail((e.target as HTMLInputElement).value) }}
                  />
                </div>
              </div>
              <button
                className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer"
                onClick={() => { handleClick() }}
              >
                Sign In
              </button>
            </div>
          </div>
        </>
      )
      }
    </>
  );
}

export default Login;