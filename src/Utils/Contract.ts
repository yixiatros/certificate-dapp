import { ethers } from 'ethers';
import { UserRole, type UserProfile } from '../Types/Auth';

// Standard contract ABI for the user and admin functions based on your Smart Contract
export const ERGASIA_ABI = [
    "function admin() view returns (address)",
    "function users(address) view returns (address userAddress, string name, uint8 role, bool active)",
    "function issuers(address) view returns (address issuerAddress, string name, bool active)",
    "function registerUser(address _userAddress, string _name, uint8 _role) public",
    "function issueCertificate(string _certificateType, address _holder, string _fileHash, uint256 _issueDate, uint256 _expiryDate) public",
    "function getHolderCertificates(address _holder) view returns (uint256[])",
    "function getIssuerCertificates(address _issuer) view returns (uint256[])",
    "function certificates(uint256) view returns (uint256 certificateId, string certificateType, address issuer, address holder, string fileHash, uint256 issueDate, uint256 expiryDate, string status, bool revoked, string revocationReason)",
    "function revokeCertificate(uint256 _certificateId, string _revocationReason) public",
    "function getAllUsers() view returns (tuple(address userAddress, string name, uint8 role, bool active)[])",
    "function getAllCertificates() view returns (tuple(uint256 certificateId, string certificateType, address issuer, address holder, string fileHash, uint256 issueDate, uint256 expiryDate, string status, bool revoked, string revocationReason)[])"
];

// Configurable contract address (can be set via environment variable or default fallback)
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export const isZeroAddress = (address: string): boolean => {
    if (!address) return true;
    const clean = address.trim();
    return clean === '0' || clean === '0x0' || clean === '0x0000000000000000000000000000000000000000' || /^0x0+$/i.test(clean);
};

export function ensureValidContractAddress(): void {
    if (isZeroAddress(CONTRACT_ADDRESS)) {
        throw new Error("Contract address is not configured or is set to 0. Please set VITE_CONTRACT_ADDRESS in your environment.");
    }
}

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

export interface UserData {
    userAddress: string;
    name: string;
    role: bigint;
    active: boolean;
}

/**
 * Fetch array of certificate IDs held by a specific holder address.
 */
export async function getHolderCertificates(holderAddress: string): Promise<bigint[]> {
    ensureValidContractAddress();
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
 * Fetch array of certificate IDs issued by a specific issuer address.
 */
export async function getIssuerCertificates(issuerAddress: string): Promise<bigint[]> {
    ensureValidContractAddress();
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const ids: bigint[] = await contract.getIssuerCertificates(issuerAddress);
    return ids;
}


/**
 * Fetch detailed certificate information by certificate ID.
 */
export async function getCertificateDetails(certificateId: bigint | number): Promise<CertificateData | null> {
    ensureValidContractAddress();
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, provider);

    try {
        const cert = await contract.certificates(certificateId);
        return {
            id: BigInt(cert.certificateId ?? cert.id ?? 0),
            certificateType: cert.certificateType,
            issuer: cert.issuer,
            holder: cert.holder,
            fileHash: cert.fileHash,
            issueDate: BigInt(cert.issueDate ?? 0),
            expiryDate: BigInt(cert.expiryDate ?? 0),
            status: cert.status,
            isRevoked: cert.revoked ?? cert.isRevoked ?? false,
            revocationReason: cert.revocationReason,
        };
    } catch (err) {
        console.error("Error fetching certificate details:", err);
        return null;
    }
}

/**
 * Register a new user in the smart contract (admin only).
 */
export async function registerUser(userAddress: string, name: string, role: number): Promise<ethers.ContractTransactionReceipt | null> {
    ensureValidContractAddress();
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
 * Issue a certificate on the smart contract (issuer only).
 */
export async function issueCertificate(
    certificateType: string,
    holder: string,
    fileHash: string,
    issueDate: number,
    expiryDate: number
): Promise<ethers.ContractTransactionReceipt | null> {
    ensureValidContractAddress();
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const tx = await contract.issueCertificate(
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
 * Revoke a certificate on the smart contract (issuer or admin).
 */
export async function revokeCertificate(
    certificateId: bigint | number,
    revocationReason: string
): Promise<ethers.ContractTransactionReceipt | null> {
    ensureValidContractAddress();
    if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Web3 wallet (MetaMask) is not available.');
    }

    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const tx = await contract.revokeCertificate(certificateId, revocationReason);
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

    ensureValidContractAddress();

    try {
        let provider: ethers.Provider;
        if (typeof window !== 'undefined' && window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum as any);
        } else {
            // Default fallback provider if web3 wallet is not injected
            provider = ethers.getDefaultProvider();
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, provider);

        const [adminAddress, userRecord] = await Promise.all([
            contract.admin().catch(() => null),
            contract.users(userAddress).catch(() => null),
        ]);

        const formattedUserAddress = userAddress.toLowerCase();
        const isAdmin = !!adminAddress && adminAddress.toLowerCase() === formattedUserAddress;

        if (userRecord && userRecord.userAddress && !isZeroAddress(userRecord.userAddress)) {
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
        throw err;
    }
}



/**
* Gell all users (admin only).
*/
export async function getAllUsers(): Promise<UserData[]> {
    ensureValidContractAddress();
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const rawUsers = await contract.getAllUsers();

    const users: UserData[] = rawUsers.map((user: any) => ({
        userAddress: user.userAddress,
        name: user.name,
        role: user.role,
        active: user.active
    }));

    return users;
}


/**
* Gell all certificates (admin only).
*/
export async function getAllCertificates(): Promise<CertificateData[]> {
    ensureValidContractAddress();
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERGASIA_ABI, signer);

    const rawCertificates = await contract.getAllCertificates();

    const certificates: CertificateData[] = rawCertificates.map((cert: any) => ({
        id: cert.certificateId,
        certificateType: cert.certificateType,
        issuer: cert.issuer,
        holder: cert.holder,
        fileHash: cert.fileHash,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        status: cert.status,
        isRevoked: cert.revoked,
        revocationReason: cert.revocationReason
    }));

    return certificates;
}