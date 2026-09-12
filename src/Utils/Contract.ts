import { ethers } from 'ethers';
import { UserRole, type UserProfile } from '../Types/Auth';

// Standard contract ABI for the user and admin functions based on your Smart Contract
export const ERGASIA_ABI = [
    "function admin() view returns (address)",
    "function users(address) view returns (address userAddress, string name, uint256 role, bool active)",
    "function issuers(address) view returns (address issuerAddress, string name, bool active)",
    "function registerUser(address _userAddress, string _name, uint256 _role) public"
];

// Configurable contract address (can be set via environment variable or default fallback)
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

/**
 * Register a new user in the smart contract (admin only).
 */
export async function registerUser(userAddress: string, name: string, role: number): Promise<ethers.ContractTransactionReceipt | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const tx = await contract.registerUser(userAddress, name, role);
    const receipt = await tx.wait();
    return receipt;
}


/**
 * Fetch role and user info for a given address directly from the smart contract.
 */
export async function fetchUserProfile(userAddress: string): Promise<UserProfile> {
    if (!userAddress) {
        return {
            address: '',
            name: '',
            role: UserRole.Unregistered,
            active: false,
            isAdmin: false,
        };
    }

    try {
        let provider: ethers.Provider;
        if (typeof window !== 'undefined' && window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum as any);
        } else {
            // Default fallback provider if web3 wallet is not injected
            provider = ethers.getDefaultProvider();
        }

        // If contract address is dummy/not configured, return fallback profile safely
        if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
            return {
                address: userAddress,
                name: 'User (Demo/Unset Contract)',
                role: UserRole.Unregistered,
                active: true,
                isAdmin: false,
            };
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, provider);

        const [adminAddress, userRecord] = await Promise.all([
            contract.admin().catch(() => null),
            contract.users(userAddress).catch(() => null),
        ]);

        const formattedUserAddress = userAddress.toLowerCase();
        const isAdmin = !!adminAddress && adminAddress.toLowerCase() === formattedUserAddress;

        if (userRecord && userRecord.userAddress && userRecord.userAddress !== "0x0000000000000000000000000000000000000000") {
            const contractRoleNumber = Number(userRecord.role);
            const role = (contractRoleNumber in UserRole) ? (contractRoleNumber as UserRole) : UserRole.Unregistered;

            return {
                address: userAddress,
                name: userRecord.name || (isAdmin ? 'Admin' : 'Registered User'),
                role: isAdmin && role === UserRole.Unregistered ? UserRole.Admin : role,
                active: userRecord.active ?? true,
                isAdmin,
            };
        }

        // Address is not in mapping, but check if it's the contract creator/admin
        if (isAdmin) {
            return {
                address: userAddress,
                name: 'Contract Admin',
                role: UserRole.Admin,
                active: true,
                isAdmin: true,
            };
        }

        return {
            address: userAddress,
            name: 'Unregistered User',
            role: UserRole.Unregistered,
            active: false,
            isAdmin: false,
        };
    } catch (err) {
        console.error("Failed to query user role from contract:", err);
        return {
            address: userAddress,
            name: 'User',
            role: UserRole.Unregistered,
            active: false,
            isAdmin: false,
        };
    }
}
