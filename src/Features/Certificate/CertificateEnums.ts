export enum CertificateStatus {
    Valid = 0,
    Expired = 1,
    Revoked = 2,
}

export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, string> = {
    [CertificateStatus.Valid]: 'Valid',
    [CertificateStatus.Expired]: 'Expired',
    [CertificateStatus.Revoked]: 'Revoked',
};

export enum CertificateType {
    Seminar = 0, 
    Professional = 1,
    Academic = 2,
    License = 3,
}

export const CERTIFICATE_TYPE_LABELS: Record<CertificateType, string> = {
    [CertificateType.Seminar]: 'Seminar',
    [CertificateType.Professional]: 'Professional',
    [CertificateType.Academic]: 'Academic',
    [CertificateType.License]: 'License',
};

