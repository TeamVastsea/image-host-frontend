'use client';

import Cookie from 'js-cookie';
import { useRouter } from "next/navigation"
import { useEffect } from "react";

import { useAccount } from "@/hooks";

// const getHash = () => (typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace('#', '')) : undefined);

export default function CallBack() {
    const router = useRouter();

    const { setAccessToken } = useAccount();
    useEffect(() => {
        const hash = window.location.hash.split('&');
        const token = hash[0].split('=')[1];
        if (token) {
            setAccessToken(token);
            Cookie.set('token', token);
            router.push('/gallery');
        }
    }, [])
    return (
        <div className="size-full flex items-center justify-center">
            <span>Loading...</span>
        </div>
    )
}