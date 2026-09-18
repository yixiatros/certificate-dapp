import React, { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { getAllUsers, type UserData } from '../../Utils/Contract';
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
    searchPlaceholder = "Search by name, or address...",
}) => {
    const { address } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchByIdOnly, setSearchByIdOnly] = useState<boolean>(false);
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
               const idStr = user.userAddress.toString().toLowerCase();
   
               if (searchByIdOnly) {
                   return idStr.includes(cleanQuery);
               }
   
               const nameStr = (user.name || '').toLowerCase();
               const roleStr = String(user.role ?? '').toLowerCase();
               const status = Boolean(user.active);
   
               return (
                   idStr.includes(cleanQuery) ||
                   nameStr.includes(query) ||
                   roleStr.includes(query) ||
                   status
               );
           });
       }, [users, searchTerm, searchByIdOnly]);

    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-transparent rounded-lg shadow-lg text-text">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-center border-b border-primary/30 pb-4">
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
                            placeholder={searchByIdOnly ? "Search by Certificate ID (e.g. 101 or #101)..." : searchPlaceholder}
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
                    <button
                        type="button"
                        onClick={() => setSearchByIdOnly(!searchByIdOnly)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${searchByIdOnly
                            ? 'bg-lightBlue text-background border-lightBlue shadow'
                            : 'bg-primary/50 text-text-secondary border-primary/50 hover:text-text hover:border-primary'
                            }`}
                        title="Toggle ID-only search filter"
                    >
                        {searchByIdOnly ? "ID Only" : "All Fields"}
                    </button>
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
            ) : users.length === 0 ? (
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
