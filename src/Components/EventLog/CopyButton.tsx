import { useEffect, useRef, useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <button onClick={handleCopy} title="Copy to clipboard" className="bg-transparent border-none cursor-pointer px-1 py-0 text-xs leading-none inline-flex items-center">
            {copied ? (
                <FaCheck size={10} className="text-success transition-colors duration-200" />
            ) : (
                <FaCopy size={10} className="text-text-muted transition-colors duration-200" />
            )}
        </button>
    );
};

export default CopyButton;
