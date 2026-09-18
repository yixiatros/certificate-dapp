import React, { useState } from 'react'
import { revokeCertificate, getCertificateDetails, getAllCertificates } from '../../Utils/Contract';

type Props = {}

const RevokeCertificate = (props: Props) => {
  const [certificateIdOrHash, setCertificateIdOrHash] = useState('');
  const [revocationReason, setRevocationReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const inputVal = certificateIdOrHash.trim();
    const reasonVal = revocationReason.trim();

    if (!inputVal) {
      setStatusMessage({ type: 'error', text: 'Please enter a Certificate ID or Hash.' });
      return;
    }

    if (!reasonVal) {
      setStatusMessage({ type: 'error', text: 'Please enter a reason for revoking the certificate.' });
      return;
    }

    try {
      setLoading(true);

      let targetId: bigint | null = null;

      if (/^\d+$/.test(inputVal)) {
        targetId = BigInt(inputVal);
      } else {
        // Search by hash or ID matching across all certificates
        const allCerts = await getAllCertificates();
        const found = allCerts.find(
          (c) => c.fileHash.toLowerCase() === inputVal.toLowerCase() || c.id.toString() === inputVal
        );
        if (found) {
          targetId = found.id;
        }
      }

      if (targetId === null) {
        setStatusMessage({ type: 'error', text: 'Certificate not found with the provided Hash.' });
        return;
      }

      // Check certificate status prior to calling contract
      const certDetails = await getCertificateDetails(targetId);
      if (!certDetails || certDetails.issuer === '0x0000000000000000000000000000000000000000') {
        setStatusMessage({ type: 'error', text: `Certificate with ID #${targetId.toString()} does not exist.` });
        return;
      }

      if (certDetails.isRevoked || certDetails.status === 'Revoked') {
        setStatusMessage({ type: 'error', text: `Certificate #${targetId.toString()} has already been revoked.` });
        return;
      }

      const receipt = await revokeCertificate(targetId, reasonVal);

      setStatusMessage({
        type: 'success',
        text: `Certificate #${targetId.toString()} revoked successfully! Transaction Hash: ${receipt?.hash ?? 'Confirmed'}`,
      });

      setCertificateIdOrHash('');
      setRevocationReason('');
    } catch (err: any) {
      console.error('Revoke certificate error:', err);
      const errorText = err?.reason || err?.message || 'Failed to revoke certificate on smart contract.';
      setStatusMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 text-text shadow-lg p-6 bg-surface/30 rounded-lg border border-primary/20">
      <h2 className="text-xl font-bold mb-6 text-center text-text">Revoke Certificate</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="mb-2 block text-sm font-bold text-text">ID or Hash of the Certificate:</label>
          <input type="text" placeholder="e.g. 1 or 2314..." value={certificateIdOrHash} onChange={(e) => setCertificateIdOrHash(e.target.value)} required
            className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-text">Revocation Reason:</label>
          <textarea rows={3} placeholder="Specify why this certificate is being revoked..." value={revocationReason} onChange={(e) => setRevocationReason(e.target.value)} required
            className="w-full p-2.5 rounded border border-primary/40 bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue resize-none"
          />
        </div>

        <button type="submit" disabled={loading} className={`mt-4 p-3 rounded font-bold text-text transition-opacity ${loading ? 'bg-background cursor-not-allowed' : 'bg-error hover:opacity-80 cursor-pointer'}`}>
          {loading ? 'Revoking Certificate...' : 'Revoke Certificate'}
        </button>
      </form>

      {statusMessage && (
        <div className={`mt-6 p-4 rounded text-text break-words border ${statusMessage.type === 'success' ? 'bg-success/20 border-success text-success' : 'bg-error/20 border-error text-error'}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  )
}

export default RevokeCertificate
