import React from 'react';
import { getIssuerCertificates } from '../../Utils/Contract';
import CertificateList from '../CertificateList/CertificateList';

const IssuerCertificates: React.FC = () => {
    return (
        <CertificateList
            fetchCertificatesFn={getIssuerCertificates}
            title="My Certificates"
            emptyMessage="No certificates issued from your address yet."
            searchPlaceholder="Search by ID, type, holder, status, or hash..."
            showHolder={true}
            showIssuer={false}
        />
    );
};

export default IssuerCertificates;
