export enum UserRole {
    Unregistered = 0,
    Admin = 1,
    Issuer = 2,
    Holder = 3,
    RevocationOfficer = 4,
    Auditor = 5,
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.Unregistered]: 'Unregistered User',
    [UserRole.Admin]: 'Admin',
    [UserRole.Issuer]: 'Issuer',
    [UserRole.Holder]: 'Holder',
    [UserRole.RevocationOfficer]: 'Revocation Officer',
    [UserRole.Auditor]: 'Auditor',
};

export interface UserProfile {
    address: string;
    name: string;
    role: UserRole;
    active: boolean;
    isAdmin: boolean;
}

export interface Session {
    address: string;
    signature: string;
    message: string;
    issuedAt: number;
    expiresAt: number;
    profile?: UserProfile;
}

export interface AuthState {
    address: string | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
    isConnecting: boolean;
    isMetaMaskInstalled: boolean;
    error: string | null;
    expiresAt: number | null;
}