import React, { useState, type JSX } from 'react';
import { revokeCertificate, getCertificateDetails, type CertificateData } from '../../Utils/Contract';
import Modal from '../Modal/Modal';

type Props = {}

const RevokeCertificate: React.FC<Props> = (props: Props): JSX.Element => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [targetCert, setTargetCert] = useState<CertificateData | null>(null);

  const [certificateId, setCertificateId] = useState('');
  const [revocationReason, setRevocationReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFetchAndConfirm = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const inputVal = certificateId.trim();
    const reasonVal = revocationReason.trim();

    if (!inputVal) {
      setStatusMessage({ type: 'error', text: 'Please enter a Certificate ID.' });
      return;
    }

    if (!reasonVal) {
      setStatusMessage({ type: 'error', text: 'Please enter a reason for revoking the certificate.' });
      return;
    }

    try {
      setLoading(true);

      if (!/^\d+$/.test(inputVal)) {
        setStatusMessage({ type: 'error', text: 'Please enter a valid numeric Certificate ID.' });
        return;
      }

      const targetId = BigInt(inputVal);

      const certDetails = await getCertificateDetails(targetId);
      if (!certDetails || certDetails.issuer === '0x0000000000000000000000000000000000000000') {
        setStatusMessage({ type: 'error', text: `Certificate with ID #${targetId.toString()} does not exist.` });
        return;
      }

      if (certDetails.isRevoked || certDetails.status === 'Revoked') {
        setStatusMessage({ type: 'error', text: `Certificate #${targetId.toString()} has already been revoked.` });
        return;
      }

      setTargetCert(certDetails);
      setModalOpen(true);
    } catch (err: any) {
      console.error('Fetch certificate error:', err);
      const errorText = err?.reason || err?.message || 'Failed to fetch certificate details.';
      setStatusMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRevoke = async () => {
    if (!targetCert) return;

    try {
      setRevoking(true);
      const receipt = await revokeCertificate(targetCert.id, revocationReason.trim());

      setStatusMessage({
        type: 'success',
        text: `Certificate #${targetCert.id.toString()} revoked successfully! Transaction Hash: ${receipt?.hash ?? 'Confirmed'}`,
      });

      setCertificateId('');
      setRevocationReason('');
      setModalOpen(false);
      setTargetCert(null);
    } catch (err: any) {
      console.error('Revoke certificate error:', err);
      const errorText = err?.reason || err?.message || 'Failed to revoke certificate on smart contract.';
      setStatusMessage({ type: 'error', text: errorText });
    } finally {
      setRevoking(false);
    }
  };

  const formatDate = (timestamp: bigint) => {
    if (!timestamp || timestamp === 0n) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg p-6 bg-surface/30 rounded-lg border border-primary/20">
        <h2 className="text-xl font-bold mb-6 text-center text-text">Revoke Certificate</h2>
        <form onSubmit={handleFetchAndConfirm} className="flex flex-col gap-4">

          <div>
            <label className="mb-2 block text-sm font-bold text-text">ID of the Certificate:</label>
            <input type="text" placeholder="e.g. 101..." value={certificateId} onChange={(e) => setCertificateId(e.target.value)} required
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
            {loading ? 'Searching Certificate...' : 'Revoke Certificate'}
          </button>
        </form>

        {statusMessage && (
          <div className={`mt-6 p-4 rounded text-text break-words border ${statusMessage.type === 'success' ? 'bg-success/20 border-success text-success' : 'bg-error/20 border-error text-error'}`}>
            {statusMessage.text}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => !revoking && setModalOpen(false)} title="Confirm Certificate Revocation" closeOnBackdropClick={!revoking}>
        {targetCert && (
          <div className="space-y-4 text-text">
            <div className="p-3 bg-error/10 border border-error/30 rounded text-error text-sm font-medium">
              Are you sure you want to revoke this certificate? This action cannot be undone.
            </div>

            <div className="bg-surface/50 border border-primary/20 p-4 rounded-lg space-y-2 text-sm">
              <p><span className="font-semibold text-text-secondary">Certificate ID:</span> #{targetCert.id.toString()}</p>
              <p><span className="font-semibold text-text-secondary">Certificate Type:</span> {targetCert.certificateType}</p>
              <p><span className="font-semibold text-text-secondary">Holder:</span> <span className="font-mono text-xs break-all">{targetCert.holder}</span></p>
              <p><span className="font-semibold text-text-secondary">Issuer:</span> <span className="font-mono text-xs break-all">{targetCert.issuer}</span></p>
              <p><span className="font-semibold text-text-secondary">File Hash:</span> <span className="font-mono text-xs break-all">{targetCert.fileHash}</span></p>
              <p><span className="font-semibold text-text-secondary">Issue Date:</span> {formatDate(targetCert.issueDate)}</p>
              <p><span className="font-semibold text-text-secondary">Expiry Date:</span> {formatDate(targetCert.expiryDate)}</p>
              <p className="pt-2 border-t border-primary/20 text-error">
                <span className="font-semibold">Reason for Revocation:</span> {revocationReason}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} disabled={revoking} className="px-4 py-2 rounded bg-surface/80 hover:bg-surface border border-primary/30 font-semibold cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmRevoke} disabled={revoking} className="px-4 py-2 rounded bg-error text-text font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50">
                {revoking ? 'Revoking...' : 'Confirm Revoke'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default RevokeCertificate

