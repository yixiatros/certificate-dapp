import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { UserRole, type AuthState, type UserProfile } from '../Types/Auth';
import { UseMetaMask } from '../Hooks/UseMetaMask';
import { SESSION_DURATION_MS, BuildSignInMessage, ClearSession, LoadValidSession, SaveSession } from '../Utils/Session';
import { fetchUserProfile, CONTRACT_ADDRESS, isZeroAddress } from '../Utils/Contract';

interface AuthContextValue extends AuthState {
    login: () => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
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
        setProfile(null);
        setExpiresAt(null);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!address) return;
        try {
            const userProfile = await fetchUserProfile(address);
            if (userProfile.role === UserRole.Unregistered || !userProfile.active) {
                logout();
                setError('Access denied: You are not a registered user.');
            } else {
                setProfile(userProfile);
            }
        } catch (err) {
            console.error('Failed to refresh user profile:', err);
        }
    }, [address, logout]);

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
    }, [logout]);

    useEffect(() => {
        const session = LoadValidSession();

        if (session) {
            if (isZeroAddress(CONTRACT_ADDRESS)) {
                logout();
                setError('Contract address is not configured or is set to 0. Please set VITE_CONTRACT_ADDRESS in your environment.');
                return;
            }

            setAddress(session.address);
            setExpiresAt(session.expiresAt);
            if (session.profile) {
                setProfile(session.profile);
            }
            // Fetch latest contract role asynchronously to verify/update
            fetchUserProfile(session.address).then((p) => {
                if (p.role === UserRole.Unregistered || !p.active) {
                    logout();
                    setError('Access denied: Account is not registered on the smart contract.');
                } else {
                    setProfile(p);
                }
            }).catch((err) => {
                console.error(err);
                logout();
                if (err instanceof Error) {
                    setError(err.message);
                }
            });
            scheduleAutoLogout(session.expiresAt);
        }

        return clearLogoutTimer;
    }, [scheduleAutoLogout, logout]);

    const login = useCallback(async () => {
        setError(null);
        setIsConnecting(true);

        try {
            if (isZeroAddress(CONTRACT_ADDRESS)) {
                throw new Error('Contract address is not configured or is set to 0. Please set VITE_CONTRACT_ADDRESS in your environment.');
            }

            const account = await requestAccounts();

            const userProfile = await fetchUserProfile(account);

            if (userProfile.role === UserRole.Unregistered || !userProfile.active) {
                throw new Error('Access denied: You are not a registered user.');
            }

            const issuedAt = Date.now();
            const nonce = crypto.randomUUID();
            const message = BuildSignInMessage(account, nonce, issuedAt);
            const signature = await signMessage(message, account);
            const expiry = issuedAt + SESSION_DURATION_MS;

            SaveSession({
                address: account,
                signature,
                message,
                issuedAt,
                expiresAt: expiry,
                profile: userProfile,
            });

            setAddress(account);
            setProfile(userProfile);
            setExpiresAt(expiry);
            scheduleAutoLogout(expiry);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message.includes('User rejected')
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
        profile,
        isAuthenticated: !!address,
        isConnecting,
        isMetaMaskInstalled,
        error,
        expiresAt,
        login,
        logout,
        refreshProfile,
    }),
        [address, profile, isConnecting, isMetaMaskInstalled, error, expiresAt, login, logout, refreshProfile],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

    return ctx;
}
