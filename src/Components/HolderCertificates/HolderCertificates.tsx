import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { getHolderCertificates, getCertificateDetails, type CertificateData } from '../../Utils/Contract';

const HolderCertificates: React.FC = () => {
    const { address } = useAuth();
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!address) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const ids = await getHolderCertificates(address);

                const certDetails = await Promise.all(
                    ids.map((id) => getCertificateDetails(id))
                );

                const validCerts = certDetails.filter((c): c is CertificateData => c !== null);
                setCertificates(validCerts);
            } catch (err: any) {
                console.error("Failed to fetch holder certificates:", err);
                setError(err?.message || "Failed to load certificates from the smart contract.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [address]);

    const formatDate = (timestamp: bigint) => {
        if (!timestamp || timestamp === 0n) return 'N/A';
        return new Date(Number(timestamp) * 1000).toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-surface rounded-lg shadow-lg text-text">
            <h2 className="text-2xl font-bold mb-6 text-center border-b border-primary/30 pb-4">
                My Certificates
            </h2>

            {loading ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">Loading your certificates from the blockchain...</p>
                </div>
            ) : error ? (
                <div className="p-4 rounded bg-error/20 border border-error text-error text-center">
                    {error}
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">No certificates issued to your address yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                        <div
                            key={cert.id.toString()}
                            className="p-5 rounded-lg border border-primary/30 bg-background/50 hover:border-lightBlue transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-lightBlue/20 text-lightBlue border border-lightBlue/30">
                                        ID: #{cert.id.toString()}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded ${
                                            cert.isRevoked
                                                ? 'bg-error/20 text-error border border-error/30'
                                                : 'bg-success/20 text-success border border-success/30'
                                        }`}
                                    >
                                        {cert.isRevoked ? 'Revoked' : cert.status || 'Valid'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-lightBlue">
                                    {cert.certificateType}
                                </h3>

                                <div className="space-y-1.5 text-sm">
                                    <p>
                                        <span className="font-semibold text-text-secondary">Issuer: </span>
                                        <span className="font-mono text-xs break-all">{cert.issuer}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-text-secondary">File Hash: </span>
                                        <span className="font-mono text-xs break-all">{cert.fileHash}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-text-secondary">Issue Date: </span>
                                        <span>{formatDate(cert.issueDate)}</span>
                                    </p>
                                    <p>
                                        <span className="font-semibold text-text-secondary">Expiry Date: </span>
                                        <span>{formatDate(cert.expiryDate)}</span>
                                    </p>

                                    {cert.isRevoked && (
                                        <p className="text-error font-medium pt-2 border-t border-error/20">
                                            <span>Revocation Reason: </span>
                                            {cert.revocationReason || 'None specified'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HolderCertificates;
