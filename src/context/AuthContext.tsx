// import React from 'react'
import { createContext } from 'react'
// import { useState } from 'react'

interface User {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string
    isVerified: boolean;

}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    // login: () ;
    logout: () => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
