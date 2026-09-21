import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaClipboardList, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import { getContractEventLogs, type ContractEvent } from '../../Utils/Contract';
import EventCard from './EventCard';
import EventFilters, { type EventFilter } from './EventFilters.tsx';

const EventLog = () => {
    const [events, setEvents] = useState<ContractEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<EventFilter>('All');
    const [search, setSearch] = useState('');

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getContractEventLogs();
            setEvents(data);
        } catch (err: any) {
            setError(err?.message ?? 'Failed to fetch event logs.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return events.filter((ev) => {
            if (filter !== 'All' && ev.eventName !== filter) return false;
            if (!q) return true;
            return (
                ev.eventName.toLowerCase().includes(q) ||
                ev.transactionHash.toLowerCase().includes(q) ||
                ev.blockNumber.toString().includes(q) ||
                Object.values(ev.args).some((v) => v.toLowerCase().includes(q))
            );
        });
    }, [events, filter, search]);

    return (
        <div className="w-full bg-surface border border-border rounded-2xl px-7 py-6">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <FaClipboardList className="text-accent text-xl" />
                <h2 className="m-0 text-lg font-bold text-text tracking-[-0.3px]">Contract Event Log</h2>
                <span className="ml-auto text-xs text-text-muted font-mono">
                    {filtered.length} / {events.length} events
                </span>
                <button onClick={fetchEvents} disabled={loading} title="Refresh"
                    className="bg-accent/10 border border-accent/30 rounded-lg text-accent cursor-pointer px-3 py-[5px] text-xs font-semibold transition-colors duration-200 inline-flex items-center gap-1.5 hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FaSyncAlt className={`text-accent ${loading ? 'animate-[spin_0.8s_linear_infinite]' : ''}`} />
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            <EventFilters
                filter={filter}
                onFilterChange={setFilter}
                search={search}
                onSearchChange={setSearch}
            />

            {loading && (
                <div className="flex flex-col items-center gap-3 py-10 text-text-muted">
                    <div className="w-9 h-9 border-[3px] border-border border-t-accent rounded-full animate-[spin_0.8s_linear_infinite]" />
                    <span className="text-[13px]">Fetching events from chain…</span>
                </div>
            )}

            {!loading && error && (
                <div className="flex items-center gap-2.5 bg-error/10 border border-error/30 rounded-[10px] px-5 py-4 text-error text-[13px]">
                    <FaExclamationTriangle />
                    {error}
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-10 text-text-muted text-[13px]">
                    No events match your filter.
                </div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                    {filtered.map((ev, idx) => (
                        <EventCard key={`${ev.transactionHash}-${ev.blockNumber}-${idx}`} event={ev} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventLog;
