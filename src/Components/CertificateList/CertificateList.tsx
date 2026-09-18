import React, { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { getCertificateDetails, type CertificateData } from '../../Utils/Contract';
import CertificateCard from '../CertificateCard/CertificateCard';

interface CertificateListProps {
    fetchCertificatesFn: (address: string) => Promise<bigint[]>;
    title?: string;
    emptyMessage?: string;
    searchPlaceholder?: string;
    showIssuer?: boolean;
    showHolder?: boolean;
}

const CertificateList: React.FC<CertificateListProps> = ({
    fetchCertificatesFn,
    title = "My Certificates",
    emptyMessage = "No certificates found.",
    searchPlaceholder = "Search by ID, type, address, status, or hash...",
    showIssuer = true,
    showHolder = true,
}) => {
    const { address } = useAuth();
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchByIdOnly, setSearchByIdOnly] = useState<boolean>(false);
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
                const ids = await fetchCertificatesFn(address);

                const certDetails = await Promise.all(
                    ids.map((id) => getCertificateDetails(id))
                );

                const validCerts = certDetails.filter((c): c is CertificateData => c !== null);
                setCertificates(validCerts);
            } catch (err: any) {
                console.error("Failed to fetch certificates:", err);
                setError(err?.message || "Failed to load certificates from the smart contract.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [address, fetchCertificatesFn]);

    const filteredCertificates = useMemo(() => {
        if (!searchTerm.trim()) return certificates;
        const query = searchTerm.toLowerCase().trim();
        const cleanQuery = query.replace(/^#/, '');

        return certificates.filter((cert) => {
            const idStr = cert.id.toString().toLowerCase();

            if (searchByIdOnly) {
                return idStr.includes(cleanQuery);
            }

            const typeStr = (cert.certificateType || '').toLowerCase();
            const issuerStr = (cert.issuer || '').toLowerCase();
            const holderStr = (cert.holder || '').toLowerCase();
            const fileHashStr = (cert.fileHash || '').toLowerCase();
            const statusStr = (cert.status || '').toLowerCase();

            return (
                idStr.includes(cleanQuery) ||
                typeStr.includes(query) ||
                issuerStr.includes(query) ||
                holderStr.includes(query) ||
                fileHashStr.includes(query) ||
                statusStr.includes(query)
            );
        });
    }, [certificates, searchTerm, searchByIdOnly]);

    return (
        <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg">
            {title && (
                <h2 className="text-xl font-bold mb-6 text-center text-text border-b border-primary/30 pb-4">
                    {title}
                </h2>
            )}

            {!loading && !error && certificates.length > 0 && (
                <div className="mb-6 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 flex items-center border pl-4 pr-3 gap-2 bg-primary border-primary/50 focus-within:border-primary h-[46px] rounded-full overflow-hidden transition-all shadow-sm w-full">
                        <FaSearch className="text-text-secondary flex-shrink-0" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchByIdOnly ? "Search by Certificate ID (e.g. 101 or #101)..." : searchPlaceholder}
                            className="bg-transparent w-full h-full outline-none text-sm text-text placeholder-text-secondary/70"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-text-secondary hover:text-text transition-colors p-1"
                                title="Clear search"
                                type="button"
                            >
                                <FaTimes size={14} />
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setSearchByIdOnly(!searchByIdOnly)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${searchByIdOnly
                            ? 'bg-lightBlue text-background border-lightBlue shadow'
                            : 'bg-primary/50 text-text-secondary border-primary/50 hover:text-text hover:border-primary'
                            }`}
                        title="Toggle ID-only search filter"
                    >
                        {searchByIdOnly ? "ID Only" : "All Fields"}
                    </button>
                </div>
            )}

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
                    <p className="text-lg">{emptyMessage}</p>
                </div>
            ) : filteredCertificates.length === 0 ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">No certificates match your search query "{searchTerm}".</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCertificates.map((cert) => (
                        <CertificateCard
                            key={cert.id.toString()}
                            cert={cert}
                            showIssuer={showIssuer}
                            showHolder={showHolder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CertificateList;
