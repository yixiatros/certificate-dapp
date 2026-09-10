export interface Session {
    address: string;
    signature: string;
    message: string;
    issuedAt: number;
    expiresAt: number;
}

export interface AuthState {
    address: string | null;
    isAuthenticated: boolean;
    isConnecting: boolean;
    isMetaMaskInstalled: boolean;
    error: string | null;
    expiresAt: number | null;
}