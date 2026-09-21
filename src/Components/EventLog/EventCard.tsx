import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { ContractEvent } from '../../Utils/Contract';
import ArgRow from './ArgRow';
import CopyButton from './CopyButton';
import { EVENT_CONFIG } from './EventConfig.ts';
import { formatTimestamp, truncate } from './Format';

const EventCard = ({ event }: { event: ContractEvent }) => {
    const [expanded, setExpanded] = useState(false);
    const { Icon, label, text, card, divider } = EVENT_CONFIG[event.eventName];
    const args = Object.entries(event.args);

    return (
        <div onClick={() => setExpanded((p) => !p)}
            className={`border border-l-[3px] rounded-[10px] px-4 py-3 cursor-pointer select-none transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] ${card}`}
        >
            <div className="flex items-center gap-2.5 flex-wrap">
                <Icon className={`${text} text-base shrink-0`} />
                <span className={`${text} text-xs font-bold uppercase tracking-[0.06em] shrink-0`}>
                    {label}
                </span>

                <span className="text-[11px] text-text-muted font-mono shrink-0">
                    Block #{event.blockNumber}
                </span>

                <span className="text-[11px] text-text-muted shrink-0">
                    {formatTimestamp(event.timestamp)}
                </span>

                <span onClick={(e) => e.stopPropagation()} className="flex items-center gap-0.5 ml-auto font-mono text-[11px] text-text-muted">
                    {truncate(event.transactionHash)}
                    <CopyButton text={event.transactionHash} />
                </span>

                <span className="text-text-muted text-xs ml-1 flex items-center">
                    {expanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </span>
            </div>

            {expanded && (
                <div onClick={(e) => e.stopPropagation()} className={`mt-3 pt-2.5 border-t flex flex-col gap-1.5 ${divider}`}>
                    {args.map(([key, val]) => (
                        <ArgRow key={key} name={key} value={val} eventName={event.eventName} />
                    ))}
                    {args.length === 0 && (
                        <span className="text-text-muted text-xs">No indexed arguments.</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventCard;
