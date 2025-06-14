'use client';

import { useAccount } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react";
import Cookie from 'js-cookie';

const getHash = () => (typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace('#', '')) : undefined);

export default function CallBack() {
    const router = useRouter();
    const param = useSearchParams();
    
    const {accessToken, setAccessToken} = useAccount();
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