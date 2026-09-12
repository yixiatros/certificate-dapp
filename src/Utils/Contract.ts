import { ethers } from 'ethers';
import { UserRole, type UserProfile } from '../Types/Auth';

// Standard contract ABI for the user and admin functions based on your Smart Contract
export const ERGASIA_ABI = [
    "function admin() view returns (address)",
    "function users(address) view returns (address userAddress, string name, uint256 role, bool active)",
    "function issuers(address) view returns (address issuerAddress, string name, bool active)",
    "function registerUser(address _userAddress, string _name, uint256 _role) public",
    "function registerIssuer(address _issuerAddress, string _name) public",
    "function issueCertificate(uint256 _certificateId, string _certificateType, address _holder, string _fileHash, uint256 _issueDate, uint256 _expiryDate) public",
    "function getHolderCertificates(address _holder) view returns (uint256[])",
    "function certificates(uint256) view returns (uint256 id, string certificateType, address issuer, address holder, string fileHash, uint256 issueDate, uint256 expiryDate, string status, bool isRevoked, string revocationReason)"
];

// Configurable contract address (can be set via environment variable or default fallback)
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export interface CertificateData {
    id: bigint;
    certificateType: string;
    issuer: string;
    holder: string;
    fileHash: string;
    issueDate: bigint;
    expiryDate: bigint;
    status: string;
    isRevoked: boolean;
    revocationReason: string;
}

/**
 * Fetch array of certificate IDs held by a specific holder address.
 */
export async function getHolderCertificates(holderAddress: string): Promise<bigint[]> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const ids: bigint[] = await contract.getHolderCertificates(holderAddress);
    return ids;
}

/**
 * Fetch detailed certificate information by certificate ID.
 */
export async function getCertificateDetails(certificateId: bigint | number): Promise<CertificateData | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, provider);

    try {
        const cert = await contract.certificates(certificateId);
        return {
            id: BigInt(cert.id),
            certificateType: cert.certificateType,
            issuer: cert.issuer,
            holder: cert.holder,
            fileHash: cert.fileHash,
            issueDate: BigInt(cert.issueDate),
            expiryDate: BigInt(cert.expiryDate),
            status: cert.status,
            isRevoked: cert.isRevoked,
            revocationReason: cert.revocationReason,
        };
    } catch (err) {
        console.error("Error fetching certificate details:", err);
        return null;
    }
}

/**
 * Register an issuer in the smart contract (admin only).
 */
export async function registerIssuer(issuerAddress: string, name: string): Promise<ethers.ContractTransactionReceipt | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const tx = await contract.registerIssuer(issuerAddress, name);
    const receipt = await tx.wait();
    return receipt;
}

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

    if (role === UserRole.Issuer) {
        const tx = await contract.registerIssuer(userAddress, name);
        const receipt = await tx.wait();
        return receipt;
    }

    const tx = await contract.registerUser(userAddress, name, role);
    const receipt = await tx.wait();
    return receipt;
}

/**
 * Issue a certificate on the smart contract (issuer only).
 */
export async function issueCertificate(
    certificateId: bigint | number,
    certificateType: string,
    holder: string,
    fileHash: string,
    issueDate: number,
    expiryDate: number
): Promise<ethers.ContractTransactionReceipt | null> {
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const tx = await contract.issueCertificate(
        certificateId,
        certificateType,
        holder,
        fileHash,
        issueDate,
        expiryDate
    );
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
