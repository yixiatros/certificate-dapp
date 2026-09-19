import React from 'react';
import { getHolderCertificates } from '../../Utils/Contract';
import CertificateList from '../CertificateList/CertificateList';

const HolderCertificates: React.FC = () => {
    return (
        <CertificateList
            fetchCertificatesFn={getHolderCertificates}
            title="My Certificates"
            emptyMessage="No certificates issued to your address yet."
            searchPlaceholder="Search by ID, type, issuer, status, or hash..."
            showHolder={false}
            showIssuer={true}
        />
    );
};

export default HolderCertificates;
