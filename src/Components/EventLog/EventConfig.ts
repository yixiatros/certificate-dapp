import type { IconType } from 'react-icons';
import { FaUserPlus, FaCertificate, FaCheckCircle, FaBan, FaHourglassEnd } from 'react-icons/fa';
import type { ContractEventName } from '../../Utils/Contract';

export interface EventStyle {
    label: string;
    Icon: IconType;
    text: string;
    card: string;
    divider: string;
    pillActive: string;
}

export const EVENT_CONFIG: Record<ContractEventName, EventStyle> = {
    UserRegistered: {
        label: 'User Registered',
        Icon: FaUserPlus,
        text: 'text-info',
        card: 'bg-info/10 border-info/25 border-l-info',
        divider: 'border-info/25',
        pillActive: 'border-info bg-info/10 text-info font-bold',
    },
    CertificateIssued: {
        label: 'Certificate Issued',
        Icon: FaCertificate,
        text: 'text-success',
        card: 'bg-success/10 border-success/25 border-l-success',
        divider: 'border-success/25',
        pillActive: 'border-success bg-success/10 text-success font-bold',
    },
    CertificateVerified: {
        label: 'Certificate Verified',
        Icon: FaCheckCircle,
        text: 'text-accent',
        card: 'bg-accent/10 border-accent/25 border-l-accent',
        divider: 'border-accent/25',
        pillActive: 'border-accent bg-accent/10 text-accent font-bold',
    },
    CertificateRevoked: {
        label: 'Certificate Revoked',
        Icon: FaBan,
        text: 'text-error',
        card: 'bg-error/10 border-error/25 border-l-error',
        divider: 'border-error/25',
        pillActive: 'border-error bg-error/10 text-error font-bold',
    },
    CertificateExpired: {
        label: 'Certificate Expired',
        Icon: FaHourglassEnd,
        text: 'text-warning',
        card: 'bg-warning/10 border-warning/25 border-l-warning',
        divider: 'border-warning/25',
        pillActive: 'border-warning bg-warning/10 text-warning font-bold',
    },
};

export const EVENT_NAMES = Object.keys(EVENT_CONFIG) as ContractEventName[];
