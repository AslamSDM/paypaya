"use client";

import React, { FC } from 'react'
import { useRouter } from 'next/navigation'

const BackButton = () => {
    const router = useRouter();
    return (
        <div className="text-[#ffffffa5] hover:bg-[#3e3e3e3a] p-[8px] rounded-[5px]" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </div>
    )
}

export default BackButton;