import React, { useState, type SyntheticEvent } from 'react'
import { CERTIFICATE_TYPE_LABELS, CertificateType } from '../../Features/Certificate/CertificateEnums';
import { fetchUserProfile, issueCertificate } from '../../Utils/Contract';
import { UserRole } from '../../Types/Auth';
import { ethers } from 'ethers';

type Props = {}

const IssueCertificate = (props: Props) => {
    const [holderAddress, setHolderAddress] = useState('');
    const [certificateType, setCertificateType] = useState<number>(CertificateType.Seminar);
    const [fileHash, setFileHash] = useState('');
    const [pdfFileHash, setPdfFileHash] = useState('');
    const [infoFileHash, setInfoFileHash] = useState('');
    const [inputMode, setInputMode] = useState('pdf'); // 'pdf' | 'text'
    const [certificateText, setCertificateText] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const getTodayString = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleInputModeChange = () => {
        if (inputMode === 'pdf') {
            setInputMode('text');
            setFileHash(infoFileHash);
            return
        }

        setInputMode('pdf');
        setFileHash(pdfFileHash);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please select a PDF file.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const buffer = reader.result as ArrayBuffer;
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setPdfFileHash(hashHex);
            setFileHash(hashHex);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleTextChange = async (text: string) => {
        setCertificateText(text);

        if (!text) {
            setFileHash('');
            return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setInfoFileHash(hashHex);
        setFileHash(hashHex);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setStatusMessage(null);

        if (!ethers.isAddress(holderAddress)) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid Holder Ethereum address.' });
            return;
        }

        if (!fileHash) {
            alert(inputMode === 'pdf' ? "Please select a PDF file." : "Please enter certificate info.");
            return;
        }

        try {
            setLoading(true);

            // Verify if the target holder address is registered
            const holderProfile = await fetchUserProfile(holderAddress.trim());
            if (holderProfile.role === UserRole.Unregistered || !holderProfile.active) {
                setStatusMessage({
                    type: 'error',
                    text: 'The specified Holder address is not registered in the system. An admin must register the user first.',
                });
                return;
            }

            // Automatically compute issueDate as current Unix timestamp (in seconds)
            const issueDate = Math.floor(Date.now() / 1000);

            // Convert selected expiry date string (YYYY-MM-DD) to Unix timestamp (in seconds), or 0 if empty
            const expiryTimestamp = expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : 0;

            const typeLabel = CERTIFICATE_TYPE_LABELS[certificateType as CertificateType] || 'Seminar';

            const receipt = await issueCertificate(
                typeLabel,
                holderAddress.trim(),
                fileHash.trim(),
                issueDate,
                expiryTimestamp
            );

            setStatusMessage({
                type: 'success',
                text: `Certificate issued successfully! Transaction Hash: ${receipt?.hash ?? 'Confirmed'}`,
            });

            setHolderAddress('');
            setFileHash('');
            setExpiryDate('');
            setCertificateType(CertificateType.Seminar);
        } catch (err: any) {
            console.error('Issue certificate error:', err);
            const errorText = err?.reason || err?.message || 'Failed to issue certificate on smart contract.';
            setStatusMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center text-text">Issue Certificate</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <label className="mb-2 text-sm font-bold text-text">Holder Ethereum Address:</label>
                    <input type="text" placeholder="0x..." value={holderAddress} onChange={(e) => setHolderAddress(e.target.value)} required
                        className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue"
                    />
                </div>

                <div>
                    <label className="mb-2 text-sm font-bold text-text">Certificate Type:</label>
                    <select value={certificateType} onChange={(e) => setCertificateType(Number(e.target.value))}
                        className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue">
                        {Object.entries(CERTIFICATE_TYPE_LABELS)
                            .map(([key, label]) => (
                                <option className='bg-surface text-text' key={key} value={key}>
                                    {label}
                                </option>
                            )
                            )}
                    </select>
                </div>

                <div>
                    <div className="relative flex h-10 rounded overflow-hidden border border-primary">
                        <button type="button" onClick={() => handleInputModeChange()} className={`flex-1 text-sm font-bold transition-colors ${ inputMode === 'pdf' ? 'bg-primary text-text' : 'bg-transparent text-text-secondary hover:bg-surface' }`}>
                            PDF File
                        </button>
                        <button type="button" onClick={() => handleInputModeChange()} className={`flex-1 text-sm font-bold transition-colors ${ inputMode === 'text' ? 'bg-primary text-text' : 'bg-transparent text-text-secondary hover:bg-surface' }`}>
                            Certificate Info
                        </button>

                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-secondary bg-surface text-xs font-bold text-text-secondary shadow">
                            or
                        </div>
                    </div>

                    {inputMode === 'pdf' ? (
                        <div className="mt-4">
                            <input type="file" accept="application/pdf" onChange={handleChange} className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text hover:file:bg-primary" />
                            <p className="mt-2 text-xs text-text-secondary break-all min-h-[1rem]">
                                {fileHash ? `Hash: ${fileHash}` : ''}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <textarea placeholder="Enter certificate info..." value={certificateText} onChange={(e) => handleTextChange(e.target.value)} rows={5} className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue resize-none"
                            />
                            <p className="mt-2 text-xs text-text-secondary break-all min-h-[1rem]">
                                {fileHash ? `Hash: ${fileHash}` : ''}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="mb-2 text-sm font-bold text-text">Expiry Date:</label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={getTodayString()}
                        className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue [color-scheme:dark]"
                    />
                </div>

                <button type="submit" disabled={loading} className={`mt-4 p-3 rounded font-bold text-text transition-opacity ${loading ? 'bg-background cursor-not-allowed' : 'bg-lightBlue hover:opacity-80 cursor-pointer'}`}>
                    {loading ? 'Issuing Certificate...' : 'Issue Certificate'}
                </button>
            </form>

            {statusMessage && (
                <div className={`mt-6 p-4 rounded text-text break-words ${statusMessage.type === 'success' ? 'bg-success' : 'bg-error'}`}>
                    {statusMessage.text}
                </div>
            )}
        </div>
    )
}

export default IssueCertificate