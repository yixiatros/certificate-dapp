import React from 'react';
import type { CertificateData } from '../../Utils/Contract';

interface CertificateCardProps {
    cert: CertificateData;
    showHolder?: boolean;
    showIssuer?: boolean;
    actions?: React.ReactNode;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
    cert,
    showHolder = true,
    showIssuer = true,
    actions,
}) => {
    const formatDate = (timestamp: bigint) => {
        if (!timestamp || timestamp === 0n) return 'N/A';
        return new Date(Number(timestamp) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-5 rounded-lg border border-primary/30 bg-surface/50 hover:border-lightBlue transition-all flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-lightBlue/20 text-lightBlue border border-lightBlue/30">
                        ID: #{cert.id.toString()}
                    </span>
                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded ${cert.isRevoked
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
                    {showIssuer && (
                        <p>
                            <span className="font-semibold text-text-secondary">Issuer: </span>
                            <span className="font-mono text-xs break-all">{cert.issuer}</span>
                        </p>
                    )}
                    {showHolder && (
                        <p>
                            <span className="font-semibold text-text-secondary">Holder: </span>
                            <span className="font-mono text-xs break-all">{cert.holder}</span>
                        </p>
                    )}
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

            {actions && <div className="mt-4 pt-3 border-t border-primary/20">{actions}</div>}
        </div>
    );
};

export default CertificateCard;
