export function truncate(str: string, start = 6, end = 4): string {
    if (!str || str.length <= start + end + 3) return str;
    return `${str.slice(0, start)}…${str.slice(-end)}`;
}

export function formatTimestamp(ts?: number): string {
    if (!ts) return '—';
    return new Date(ts * 1000).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

// Keep in sync with the Role enum in the Solidity contract.
const ROLE_LABELS: Record<string, string> = {
    '0': 'None',
    '1': 'Admin',
    '2': 'Issuer',
    '3': 'Holder',
    '4': 'Revocation Officer',
    '5': 'Auditor',
    '6': 'Verifier',
};

export function roleLabel(role: string): string {
    return ROLE_LABELS[role] ?? role;
}
