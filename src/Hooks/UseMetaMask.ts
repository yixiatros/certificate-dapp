import { useCallback, useEffect, useState } from 'react';

interface UseMetaMaskResult {
    isMetaMaskInstalled: boolean;
    account: string | null;
    requestAccounts: () => Promise<string>;
    signMessage: (message: string, address: string) => Promise<string>;
}

export function UseMetaMask(onAccountsChanged: (account: string | null) => void): UseMetaMaskResult {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined' && !!window.ethereum.isMetaMask);
    }, []);

    useEffect(() => {
        const ethereum = window.ethereum;
        if (!ethereum) return;

        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            const next = accounts.length > 0 ? accounts[0] : null;
            setAccount(next);
            onAccountsChanged(next);
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);

        return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [onAccountsChanged]);

    const requestAccounts = useCallback(async (): Promise<string> => {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        const accounts = (await window.ethereum.request({
            method: 'eth_requestAccounts',
        })) as string[];

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned by MetaMask');
        }
        
        setAccount(accounts[0]);
        
        return accounts[0];
    }, []);

    const signMessage = useCallback(async (message: string, address: string): Promise<string> => {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        const signature = (await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address],
        })) as string;

        return signature;
    }, []);

    return { isMetaMaskInstalled, account, requestAccounts, signMessage };
}
