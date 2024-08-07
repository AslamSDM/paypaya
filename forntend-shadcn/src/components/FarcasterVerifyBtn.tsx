"use client";

import { FC, useEffect, useState } from 'react'
import { SignInButton } from '@farcaster/auth-kit';

const FarcasterVerifyBtn: FC = () => {

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [fid, setFid] = useState<number | undefined>(undefined);

    useEffect(() => {
        // SignIn Button Text Reset
        const signInBtn = document.querySelector(".fc-authkit-signin-button span");
        if (signInBtn) signInBtn.textContent = "Connect with Farcaster"
    }, [])

    return (
        <div className="flex w-full p-[10px] rounded-[5px] gap-[15px] px-[20px] border border-[#ffffff1f] bg-[#ffffff05] hover:bg-[#ffffff1f] cursor-pointer">
            <SignInButton
                onSuccess={({ fid, username }) => {
                    setFid(fid);
                    setUsername(username);
                }
                }
            />
            {fid && <span className='text-white'>{`@${username} Connected, FID: ${fid}`}</span>}
        </div>
    )
}

export default FarcasterVerifyBtn