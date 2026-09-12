import React, { useState, type ChangeEvent } from 'react';
import { registerUser } from '../../Utils/Contract';
import { UserRole, USER_ROLE_LABELS } from '../../Types/Auth';
import { ethers } from 'ethers';

const AdminRegisterUser: React.FC = () => {
    const [userAddress, setUserAddress] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<number>(UserRole.Holder);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [nameLabel, setNameLabel] = useState('Name:');


    const onChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);

        if (value === UserRole.Issuer) {
            setNameLabel('Company Name:');
        } else {
            setNameLabel('Name:');
        }

        setRole(Number(e.target.value));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setStatusMessage(null);

        if (!ethers.isAddress(userAddress)) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid Ethereum address.' });
            return;
        }

        if (!name.trim()) {
            setStatusMessage({ type: 'error', text: 'Please enter a user name.' });
            return;
        }

        try {
            setLoading(true);
            const receipt = await registerUser(userAddress.trim(), name.trim(), role);
            setStatusMessage({
                type: 'success',
                text: `User registered successfully! Transaction Hash: ${receipt?.hash ?? 'Confirmed'}`,
            });
            setUserAddress('');
            setName('');
            setRole(UserRole.Holder);
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorText = err?.reason || err?.message || 'Failed to register user on smart contract.';
            setStatusMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="max-w-xl mx-auto my-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-text">Register New User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="mb-2 text-sm font-bold text-text">User Ethereum Address:</label>
                <input type="text" placeholder="0x..." value={userAddress} onChange={(e) => setUserAddress(e.target.value)} required
                    className="w-full p-2.5 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-lightBlue"
                />
            </div>

            <div>
                <label className="mb-2 text-sm font-bold text-text">Role:</label>
                <select value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeRole(e)}
                    className="w-full p-2.5 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-lightBlue">
                        { Object.entries(USER_ROLE_LABELS)
                            .filter(([key]) => Number(key) !== UserRole.Unregistered)
                            .map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                <label className="mb-2 text-sm font-bold text-text">{nameLabel}</label>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full p-2.5 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-lightBlue"
                />
            </div>

            <button type="submit" disabled={loading} className={`mt-4 p-3 rounded font-bold text-text transition-opacity ${loading ? 'bg-background cursor-not-allowed' : 'bg-lightBlue hover:opacity-80 cursor-pointer'}`}>
                {loading ? 'Registering on Blockchain...' : 'Register User'}
            </button>
        </form>

        {statusMessage && (
            <div className={`mt-6 p-4 rounded text-text break-words ${statusMessage.type === 'success' ? 'bg-success' : 'bg-error'}`}>
              {statusMessage.text}
            </div>
        )}
    </div>
  );
};

export default AdminRegisterUser;
