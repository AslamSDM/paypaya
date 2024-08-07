"use client";
import { FC } from 'react'
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'

const WorldIDVerifyBtn: FC = () => {

    const onSuccess = () => {
        // This is where you should perform any actions after the modal is closed
        // Such as redirecting the user to a new page
        alert("Huraaaaah Success")
    };

    const handleVerify = async (proof: ISuccessResult) => {
        const res = await fetch("/api/verifyWorldCoin", { // route to your backend will depend on implementation
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(proof),
        })
        if (!res.ok) {
            throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
        }
    };

    return (
        <IDKitWidget
            app_id="app_staging_5e32fecc3a83581ebf68c2b46432826b" // obtained from the Developer Portal
            action="verify" // obtained from the Developer Portal
            onSuccess={onSuccess} // callback when the modal is closed
            handleVerify={handleVerify} // callback when the proof is received
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