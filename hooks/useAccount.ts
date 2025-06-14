'use client';

import { useState } from "react"

export const useAccount = () => {
    const [accessToken, _setAccssToken] = useState('');
    const setAccessToken = (token: string) => {
        localStorage.setItem('token', `Bearer ${token}`);
        _setAccssToken(`Bearer ${token}`);
    }
    return {accessToken, setAccessToken}
}