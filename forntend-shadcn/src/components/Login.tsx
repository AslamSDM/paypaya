"use client";

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"


// import countryCode from "country-codes-list";
// enum CountryProperty {
//   countryNameEn = 'countryNameEn',
//   countryCallingCode = 'countryCallingCode',
// }

// const countryCodes = countryCode.customList(CountryProperty.countryNameEn, '{countryCallingCode}');

// console.log(Object.keys(countryCodes))

const countryCodes = {
  India: "+91",
  US: "+1"
}

const countries = Object.keys(countryCodes);
const codes = Object.values(countryCodes);

const Login = () => {

  const [dialCode, setDialCode] = useState<string>("+91");
  const [phoneNo, setPhoneNumber] = useState<string>("");


  return (
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
                {
                  countries.map((country, i) => {
                    return <SelectItem key={i} value={codes[i]}>{`${country} (${codes[i]})`}</SelectItem>
                  })
                }
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="text-[#ffffffb3] text-[0.8em]">Number</label>
            <Input type="text" placeholder="Enter Phone Number" className="bg-transparent text-white" onInput={(e) => { setPhoneNumber((e.target as HTMLInputElement).value) }} />
          </div>
        </div>
        <div className="flex justify-center text-white items-center bg-[#335fff] w-[75%] max-w-[300px] py-[15px] font-bold rounded-[25px] my-[40px] cursor-pointer">
          Get Started
        </div>
      </div>
    </div>
  )
}

export default Login;