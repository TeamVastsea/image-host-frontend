'use client'
import { useRouter } from "next/navigation";

const URL = `${process.env.NEXT_PUBLIC_SSO_BASE}?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`
export default function Login(){
    const router = useRouter();
    router.push(URL);
    return (
        <div className="size-full flex flex-auto items-center justify-center">
            <span>Loading...</span>
        </div>
    )
}