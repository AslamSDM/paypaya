"use client"
import { FC, useState ,useEffect} from "react";
import { useRouter } from 'next/navigation'
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
 
import {
    useAuthModal,
    useLogout,
    useSignerStatus,
    useUser,
  } from "@account-kit/react";

const shortAddress = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-5)}`


const client = createThirdwebClient({ clientId: "9d8e88833e340a456e0b8f13601d81f7" });
const data = {
    address: "0x838022424e339deC8f4EF15886e360ccA5ad992A",
    native: {
        symbol: "USDC",
        balance: 0.0067,
        usdValue: 18.37
    }
}

const Loan: FC = () => {
    const [addr, setAddr] = useState(""); // Assuming you need to set this address somewhere
    const [contractData, setContractData] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const contract = getContract({
        client,
        address: "0xE63a7C8843116B4476c1979e4d072041c241A80A",
        chain: baseSepolia,
      });

      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const { data, isLoading: contractLoading } = await useReadContract({
              contract: contract,
              method: "function get_credit_worthiness(address user) public view returns (uint256)",
              params: [addr]
            });
            setContractData(Number(data));
            setIsLoading(contractLoading);
          } catch (error) {
            console.error("Error fetching contract data:", error);
            setIsLoading(false);
          }
        };
        fetchData()
    },[])
    const user = useUser()
    const router = useRouter()

    return (
        <div className="flex flex-col justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] text-white pb-[40px]">
                <div className="flex w-full items-center justify-around">
                    <div className="flex justify-around items-center bg-[#c4c4c417] px-[10px] rounded-b-[5px]">
                        <div className="text-[1.em]">{shortAddress(data.address)}</div>
                        <div className="p-[6px]">
                            <img className="h-[25px] cursor-pointer" onClick={() => { navigator.clipboard.writeText(data.address) }} src="/copy.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center my-[40px]">
                    <div className="font-medium text-[0.8em] mb-[-5px]">
                        Credit Score
                    </div>
                    <div className="font-medium text-[2.5em] mb-[-5px]">
                        {data.native.balance} {data.native.symbol}
                    </div>

                </div>
                <div className="flex w-[50%] mt-[20px]">
                    <div className="flex justify-center w-full
                     text-white items-center px-[20px] py-[10px] bg-[#335fff] hover:bg-[#335fff89] rounded-[25px] font-bold text-[1.2em] cursor-pointer" onClick={() => { router.push('/loan-input') }}>
                        Lend
                    </div>
                </div>
                <div className="flex flex-col items-center my-[40px]">
                    <div className="text-[rgba(255,255,255,0.51)] text-[0.8em]">
                        You can increase credit score by connecting socials
                    </div>
                </div>
                <div className="flex w-[50%] mt-[20px]">
                    <div className="flex justify-center w-full
                     text-white items-center px-[20px] py-[10px] bg-[#335fff] hover:bg-[#335fff89] rounded-[25px] font-bold text-[1.2em] cursor-pointer" onClick={() => { router.push('/connect') }}>
                        Connect
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loan;