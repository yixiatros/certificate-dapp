import { getAllCertificateIds } from "../../Utils/Contract"
import CertificateList from "../CertificateList/CertificateList"

const AllCertificates = () => {
    return (
        <CertificateList
            fetchCertificatesFn={getAllCertificateIds}
            title="All Certificates"
            emptyMessage="No certificates issued from your address yet."
            searchPlaceholder="Search by ID, type, holder, status, or hash..."
            showHolder={true}
            showIssuer={true}
        />
    )
}

export default AllCertificates