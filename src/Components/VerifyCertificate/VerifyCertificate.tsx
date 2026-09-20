import React, { useState } from 'react';
import { verifyCertificateByHash, verifyCertificateById, type CertificateData } from '../../Utils/Contract';

type Props = {};
type InputMode = 'pdf' | 'text' | 'id';

const VerifyCertificate = (props: Props) => {
  const [inputMode, setInputMode] = useState<InputMode>('pdf');
  const [certificateText, setCertificateText] = useState('');
  const [pdfFileHash, setPdfFileHash] = useState('');
  const [infoFileHash, setInfoFileHash] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Switch modes and sync active hash/ID state
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setStatusMessage(null);

    if (mode === 'pdf') {
      setFileHash(pdfFileHash);
    } else if (mode === 'text') {
      setFileHash(infoFileHash);
    } else if (mode === 'id') {
      setFileHash(''); // Clear file hash when switching to ID verification
    }
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

    if (!text.trim()) {
      setInfoFileHash('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (inputMode === 'id' && !certificateId.trim()) {
      alert("Please enter a certificate ID.");
      return;
    }
    if (inputMode === 'pdf' && !pdfFileHash) {
      alert("Please select a PDF file.");
      return;
    }
    if (inputMode === 'text' && !certificateText.trim()) {
      alert("Please enter certificate info.");
      return;
    }

    try {
      setLoading(true);
      let certificateExists: CertificateData | null = null;

      if (inputMode === 'id') {
        const idAsBigInt = BigInt(certificateId.trim());
        certificateExists = await verifyCertificateById(idAsBigInt);
      } else {
        certificateExists = await verifyCertificateByHash(fileHash.trim());
      }

      if (certificateExists == null) {
        setStatusMessage({
          type: 'error',
          text: 'Certificate not found.',
        });
        return;
      }

      setStatusMessage({
        type: 'success',
        text: 'Certificate verified successfully!',
      });
    } catch (err: any) {
      console.error('Verify certificate error:', err);
      const errorText = err?.reason || err?.message || 'Failed to verify certificate on smart contract.';
      setStatusMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center text-text">Verify Certificate</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="relative flex h-10 rounded overflow-hidden border border-primary">

            <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-secondary bg-surface text-xs font-bold text-text-secondary shadow">
              or
            </div>
            <div className="pointer-events-none absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-secondary bg-surface text-xs font-bold text-text-secondary shadow">
              or
            </div>


            <button
              type="button"
              onClick={() => handleInputModeChange('pdf')}
              className={`flex-1 text-sm font-bold transition-colors ${inputMode === 'pdf' ? 'bg-primary text-text' : 'bg-transparent text-text-secondary hover:bg-surface'}`}
            >
              PDF File
            </button>
            <button
              type="button"
              onClick={() => handleInputModeChange('text')}
              className={`flex-1 text-sm font-bold transition-colors ${inputMode === 'text' ? 'bg-primary text-text' : 'bg-transparent text-text-secondary hover:bg-surface'}`}
            >
              Certificate Info
            </button>
            <button
              type="button"
              onClick={() => handleInputModeChange('id')}
              className={`flex-1 text-sm font-bold transition-colors ${inputMode === 'id' ? 'bg-primary text-text' : 'bg-transparent text-text-secondary hover:bg-surface'}`}
            >
              Certificate ID
            </button>

          </div>

          {inputMode === 'pdf' && (
            <div className="mt-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleChange}
                className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-surface file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text hover:file:bg-primary"
              />
            </div>
          )}

          {inputMode === 'text' && (
            <div className="mt-4">
              <textarea
                placeholder="Enter certificate info..."
                value={certificateText}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={5}
                className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue resize-none"
              />
            </div>
          )}

          {inputMode === 'id' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter certificate ID..."
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="w-full p-2.5 rounded border-0 border-b border-primary bg-transparent text-text focus:outline-none focus:ring-2 focus:ring-lightBlue"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 p-3 rounded font-bold text-text transition-opacity ${loading ? 'bg-background cursor-not-allowed' : 'bg-lightBlue hover:opacity-80 cursor-pointer'}`}
        >
          {loading ? 'Verifying Certificate...' : 'Verify Certificate'}
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

export default VerifyCertificate;