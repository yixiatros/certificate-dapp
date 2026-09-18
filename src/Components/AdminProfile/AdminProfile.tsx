import React from 'react'
import { useAuth } from '../../Context/AuthContext';
import { USER_ROLE_LABELS } from '../../Types/Auth';

type Props = {}

const AdminProfile = (props: Props) => {
  const { address, profile, expiresAt } = useAuth();

  return (
    <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center text-text">Profile Details</h2>
      <div className="divide-y divide-primary">
        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-bold text-text">
            Address
          </p>
          <p className="mt-1 break-all text-sm text-text-secondary">
            {address}
          </p>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-bold text-text">
            Name
          </p>
          <p className="mt-1 text-sm font-medium text-text-secondary">
            {profile?.name ?? "—"}
          </p>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-bold text-text">
            Role
          </p>
          <span className="mt-1 inline-flex rounded-full bg-lightBlue/20 px-3 py-1 text-sm font-medium text-lightBlue border border-lightBlue/40">
            {USER_ROLE_LABELS[profile?.role ?? 0]}
          </span>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-sm font-bold text-text">
            Session expires at
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {new Date(expiresAt ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>

  )
}

export default AdminProfile