import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    closeOnBackdropClick?: boolean;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, closeOnBackdropClick }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
        }};

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements[0]?.focus();
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div 
            className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => closeOnBackdropClick && onClose()}
        >
            <div
                className={`w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto rounded-lg bg-background transition-all duration-200 ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button className="text-2xl leading-none text-gray-500 hover:text-gray-800" onClick={onClose}>×</button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
}

export default Modal