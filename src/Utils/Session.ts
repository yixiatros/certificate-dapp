import { verifyMessage } from 'ethers';
import type { Session } from '../Types/Auth';

const SESSION_KEY = 'mm_auth_session';

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function BuildSignInMessage(address: string, nonce: string, issuedAt: number): string {
    return [
        'Sign in to MetaMask Auth Demo',
        '',
        `Address: ${address}`,
        `Nonce: ${nonce}`,
        `Issued At: ${new Date(issuedAt).toISOString()}`,
        '',
        'This request will not trigger a blockchain transaction or cost any gas fees.',
    ].join('\n');
}

export function SaveSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function ClearSession(): void {
    localStorage.removeItem(SESSION_KEY);
}

export function ReadRawSession(): Session | null {
    const raw = localStorage.getItem(SESSION_KEY);
    
    if (!raw) return null;
    
    try {
        return JSON.parse(raw) as Session;
    } catch {
        return null;
    }
}

export function LoadValidSession(): Session | null {
    const session = ReadRawSession();

    if (!session) return null;

    if (Date.now() > session.expiresAt) {
        ClearSession();
        return null;
    }

    try {
        const recovered = verifyMessage(session.message, session.signature);

        if (recovered.toLowerCase() !== session.address.toLowerCase()) {
            ClearSession();
            return null;
        }
        
    } catch {
        ClearSession();
        return null;
    }

    return session;
}
