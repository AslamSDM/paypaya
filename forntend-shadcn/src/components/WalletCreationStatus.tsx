import { FC } from "react";
import { Input } from "./ui/input";

interface Props {
    status: Boolean,
    address?: string
}

const WalletCreationStatus: FC<Props> = ({ status, address }) => {

    return (
        <div className="flex justify-center items-center w-screen min-h-screen select-none py-[50px]">
            <div className="flex flex-col items-center border h-fit w-[95%] md:w-[80%] lg:w-[40%] border-[#ffffff15] bg-[rgba(31,31,31,0.1)] rounded-[10px] py-[30px] text-white">
                {status &&
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-[10px]">
                            <div className="font-bold text-[1.5em]">Wallet Created </div>
                            <img className="h-[40px]" src="https://static.vecteezy.com/system/resources/thumbnails/017/350/123/small_2x/green-check-mark-icon-in-round-shape-design-png.png" alt="" />
                        </div>
                        <div className="flex flex-col w-full gap-[5px] mt-[30px]">
                            <label className="text-sm text-[#fff7]">Wallet Address</label>
                            <Input className="disabled:cursor-pointer disabled:opacity-1" disabled value={address} />
                        </div>
                    </div>
                }
                {!status && "Failed"}
            </div>
        </div>
    )
}

export default WalletCreationStatus;