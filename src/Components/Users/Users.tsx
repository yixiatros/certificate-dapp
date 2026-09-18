import React from 'react';
import { getAllUsers } from '../../Utils/Contract';
import UserList from '../UserList/UserList';

const Users: React.FC = () => {
    return (
        <UserList
            fetchUsersFn={getAllUsers}
            title="Users"
            emptyMessage="No users are registered."
            searchPlaceholder="Search by address or name..."
        />
    );
};

export default Users;
