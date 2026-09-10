import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../Types/Auth';
import { UseMetaMask } from '../Hooks/UseMetaMask';
import { SESSION_DURATION_MS, BuildSignInMessage, ClearSession, LoadValidSession, SaveSession,} from '../Utils/Session';

interface AuthContextValue extends AuthState {
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLogoutTimer = () => {
        if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
        logoutTimer.current = null;
        }
    };

    const logout = useCallback(() => {
        ClearSession();
        clearLogoutTimer();
        setAddress(null);
        setExpiresAt(null);
    }, []);

    // If MetaMask reports a different (or no) account than the active
    // session, the session is no longer trustworthy - drop it.
    const handleAccountsChanged = useCallback(
        (nextAccount: string | null) => {
        setAddress((current) => {
            if (!current) return current;
            if (!nextAccount || nextAccount.toLowerCase() !== current.toLowerCase()) {
            logout();
            return null;
            }
            return current;
        });
        },
        [logout],
    );

    const { isMetaMaskInstalled, requestAccounts, signMessage } = UseMetaMask(handleAccountsChanged);

    // Auto-expire the session client-side without needing a page refresh.
    const scheduleAutoLogout = useCallback((expiry: number) => {
        clearLogoutTimer();
        const msRemaining = expiry - Date.now();
        if (msRemaining <= 0) {
            logout();
            return;
        }
        logoutTimer.current = setTimeout(logout, msRemaining);
    },[logout],);

    useEffect(() => {
        const session = LoadValidSession();

        if (session) {
            setAddress(session.address);
            setExpiresAt(session.expiresAt);
            scheduleAutoLogout(session.expiresAt);
        }

        return clearLogoutTimer;
    }, []);

    const login = useCallback(async () => {
        setError(null);
        setIsConnecting(true);
        
        try {
            const account = await requestAccounts();
            const issuedAt = Date.now();
            const nonce = crypto.randomUUID();
            const message = BuildSignInMessage(account, nonce, issuedAt);
            const signature = await signMessage(message, account);
            const expiry = issuedAt + SESSION_DURATION_MS;

            SaveSession({ address: account, signature, message, issuedAt, expiresAt: expiry });
            setAddress(account);
            setExpiresAt(expiry);
            scheduleAutoLogout(expiry);
        } catch (err) {
            const message =
                err instanceof Error
                ? // MetaMask rejects with code 4001 when the user cancels - surface that plainly.
                    err.message.includes('User rejected')
                    ? 'Signature request was rejected.'
                    : err.message
                : 'Something went wrong connecting to MetaMask.';
            setError(message);
            logout();
        } finally {
            setIsConnecting(false);
        }
    }, [requestAccounts, signMessage, scheduleAutoLogout, logout]);

    const value = useMemo<AuthContextValue>(() => ({
            address,
            isAuthenticated: !!address,
            isConnecting,
            isMetaMaskInstalled,
            error,
            expiresAt,
            login,
            logout,
        }), 
        [address, isConnecting, isMetaMaskInstalled, error, expiresAt, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    
    return ctx;
}
