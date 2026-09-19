import React, { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { getAllUsers, type UserData } from '../../Utils/Contract';
import { USER_ROLE_LABELS } from '../../Types/Auth';
import UserCard from '../UserCard/UserCard';

interface UserListProps {
    fetchUsersFn: (address: string) => Promise<UserData[]>;
    title?: string;
    emptyMessage?: string;
    searchPlaceholder?: string;
}

const UserList: React.FC<UserListProps> = ({
    fetchUsersFn,
    title = "Users",
    emptyMessage = "No users found.",
    searchPlaceholder = "Search by name, address, or role...",
}) => {
    const { address } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsersList = async () => {
            if (!address) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
            } catch (err: any) {
                console.error("Failed to fetch users:", err);
                setError(err?.message || "Failed to load users from the smart contract.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsersList();
    }, [address, fetchUsersFn]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const query = searchTerm.toLowerCase().trim();
        const cleanQuery = query.replace(/^#/, '');

        return users.filter((user) => {
            const idStr = (user.userAddress || '').toString().toLowerCase();
            const nameStr = (user.name || '').toLowerCase();
            const roleNumber = Number(user.role);
            const roleLabel = (USER_ROLE_LABELS[roleNumber as keyof typeof USER_ROLE_LABELS] || '').toLowerCase();
            const roleRawStr = String(user.role ?? '').toLowerCase();

            return (
                idStr.includes(cleanQuery) ||
                nameStr.includes(query) ||
                roleLabel.includes(query) ||
                roleRawStr.includes(query)
            );
        });
    }, [users, searchTerm]);

    return (
        <div className="w-full max-w-xl mx-auto my-8 text-text shadow-lg">
            {title && (
                <h2 className="text-xl font-bold mb-6 text-center text-text border-b border-primary/30 pb-4">
                    {title}
                </h2>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="mb-6 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 flex items-center border pl-4 pr-3 gap-2 bg-primary border-primary/50 focus-within:border-primary h-[46px] rounded-full overflow-hidden transition-all shadow-sm w-full">
                        <FaSearch className="text-text-secondary flex-shrink-0" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="bg-transparent w-full h-full outline-none text-sm text-text placeholder-text-secondary/70"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-text-secondary hover:text-text transition-colors p-1"
                                title="Clear search"
                                type="button"
                            >
                                <FaTimes size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">Loading users from the blockchain...</p>
                </div>
            ) : error ? (
                <div className="p-4 rounded bg-error/20 border border-error text-error text-center">
                    {error}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">{emptyMessage}</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-text-secondary">
                    <p className="text-lg">No users match your search query "{searchTerm}".</p>
                </div>
            ) : (
                <div className="">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.userAddress.toString()}
                            user={user}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;
