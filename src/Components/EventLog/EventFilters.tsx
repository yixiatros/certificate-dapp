import { FaClipboardList, FaSearch } from 'react-icons/fa';
import type { ContractEventName } from '../../Utils/Contract';
import { EVENT_CONFIG, EVENT_NAMES } from './EventConfig';

export type EventFilter = ContractEventName | 'All';

const pillBase = 'px-3 py-1 rounded-full border text-[11px] cursor-pointer transition-all duration-200 whitespace-nowrap inline-flex items-center gap-[5px]';
const pillInactive = 'border-border bg-transparent text-text-muted font-normal';
const pillActiveAll = 'border-accent bg-accent/10 text-accent font-bold';

interface EventFiltersProps {
    filter: EventFilter;
    onFilterChange: (filter: EventFilter) => void;
    search: string;
    onSearchChange: (value: string) => void;
}

const EventFilters = ({ filter, onFilterChange, search, onSearchChange }: EventFiltersProps) => (
    <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => onFilterChange('All')} className={`${pillBase} ${filter === 'All' ? pillActiveAll : pillInactive}`}>
            <FaClipboardList className="text-accent" />
            All Events
        </button>

        {EVENT_NAMES.map((name) => {
            const { Icon, label, text, pillActive } = EVENT_CONFIG[name];
            return (
                <button key={name} onClick={() => onFilterChange(name)} className={`${pillBase} ${filter === name ? pillActive : pillInactive}`}>
                    <Icon className={text} />
                    {label}
                </button>
            );
        })}

        <div className="ml-auto flex items-center gap-1.5 bg-surface-elevated border border-border rounded-lg px-3 py-[5px] min-w-[200px]">
            <FaSearch className="text-text-muted text-[11px]" />
            <input type="text" placeholder="Search address, hash, block…" value={search} onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none text-text text-xs outline-none w-full placeholder:text-text-muted"
            />
        </div>
    </div>
);

export default EventFilters;
