import type { ContractEventName } from '../../Utils/Contract';
import CopyButton from './CopyButton.tsx';
import { EVENT_CONFIG } from './EventConfig';
import { roleLabel, truncate } from './Format';

interface ArgRowProps {
    name: string;
    value: string;
    eventName: ContractEventName;
}

const ArgRow = ({ name, value, eventName }: ArgRowProps) => {
    const isAddress = value.startsWith('0x') && value.length === 42;
    const isHash = value.startsWith('0x') && value.length === 66;
    const isRole = name === 'role';
    const needsCopy = isAddress || isHash;
    const displayValue = needsCopy ? truncate(value) : isRole ? roleLabel(value) : value;

    return (
        <div className="flex gap-2 items-center flex-wrap">
            <span className="text-text-muted text-[11px] min-w-[80px]">{name}:</span>
            <span className={`font-mono text-xs break-all ${EVENT_CONFIG[eventName].text}`} title={value}>
                {displayValue}
            </span>
            {needsCopy && <CopyButton text={value} />}
        </div>
    );
};

export default ArgRow;
