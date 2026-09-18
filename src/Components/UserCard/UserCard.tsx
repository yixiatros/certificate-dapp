import React from 'react';
import type { UserData } from '../../Utils/Contract';
import { USER_ROLE_LABELS } from '../../Types/Auth';

interface UserCardProps {
    user: UserData;
    actions?: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({
    user
}) => {

    const roleLabel = USER_ROLE_LABELS[Number(user.role) as keyof typeof USER_ROLE_LABELS] ?? 'Unknown';

    return (
        <div className="p-5 mb-5 rounded-lg border border-primary/30 bg-surface/50 hover:border-lightBlue transition-all flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">

                    <h3 className="text-xl font-bold mb-2 text-lightBlue">
                        {user.name}
                    </h3>
                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded ${!user.active
                            ? 'bg-error/20 text-error border border-error/30'
                            : 'bg-success/20 text-success border border-success/30'
                            }`}
                    >
                        {user.active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <span className="text-xs font-semibold   text-text-secondary   text-wrap">
                    Address: {user.userAddress.toString()}
                </span>

                <p className="mt-5 ">
                    <span className="font-semibold text-text-secondary">{roleLabel} </span>
                </p>
            </div>
        </div>
    );
};

export default UserCard;
