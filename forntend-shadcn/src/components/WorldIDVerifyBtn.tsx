"use client";
import { FC } from 'react'
import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "@/app/actions/worldIDVerify";

const WorldIDVerifyBtn: FC = () => {

    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_WLD_ACTION;

    if (!app_id) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!action) {
        throw new Error("action is not set in environment variables!");
    }

    const { setOpen } = useIDKit();

    const onSuccess = (result: ISuccessResult) => {
        // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
        window.alert(
            "Successfully verified with World ID! Your nullifier hash is: " +
            result.nullifier_hash
        );
    };

    const handleProof = async (result: ISuccessResult) => {
        console.log(
            "Proof received from IDKit, sending to backend:\n",
            JSON.stringify(result)
        ); // Log the proof from IDKit to the console for visibility
        const data = await verify(result);
        if (data.success) {
            console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
        } else {
            throw new Error(`Verification failed: ${data.detail}`);
        }
    };

    return (
        <IDKitWidget
            app_id={app_id} // obtained from the Developer Portal
            action={action} // obtained from the Developer Portal
            onSuccess={onSuccess} // callback when the modal is closed
            handleVerify={handleProof} // callback when the proof is received
            verification_level={VerificationLevel.Orb}
        >
            {({ open }) =>
                // This is the button that will open the IDKit modal
                <div className="flex items-center w-full p-[10px] rounded-[5px] gap-[15px] px-[20px] border border-[#ffffff1f] bg-[#ffffff05] hover:bg-[#ffffff1f] cursor-pointer" onClick={open}>
                    <div className="flex justify-center items-center bg-white rounded-[50%]">
                        <img className="h-[30px]" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHr/7WAAAAFHRSTlMAJ2J+iTQXmv+1BOzTUt3FQaM8Qxpb+LkAAADQSURBVHgBfJKFEcMwDABl/jDtv2urC8kp/IFBDHLjfIjBJ/kkF04aJzUFS9Nasw7ovdPr0AC4WwaM5jkBZ+gWKGLxQN6vE0RRXCg7cYROlAEaPXNPRZA3I+gx80R9QdwPlj3O6W8QCXvsUR8WNNjEuBsWqWjUb8eU1lRgWC1pgVb4Tf4rVLfrtqrbeTOs6vZ/QvFfKQ7Cbkqpm+DfRwf62nhiG+/GZ+OV6by4sOwUHdk97CiW4R52m4HerEkDrPWCTT7fC5Zew5s0CSdqvNkBAB8pD27Wz4UiAAAAAElFTkSuQmCC" alt="World Coin" />
                    </div>
                    <div className="text-white font-semibold">Connect with WorldCoin</div>
                </div>
                // <button onClick={open}>Verify with World ID</button>
            }
        </IDKitWidget>
    )
}

export default WorldIDVerifyBtn