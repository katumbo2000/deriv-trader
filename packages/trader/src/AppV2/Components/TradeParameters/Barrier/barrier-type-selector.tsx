import React, { useMemo } from 'react';

import { localize } from '@deriv-com/translations';

import type { VerticalTabItem } from '../../InputPopover/vertical-tab-selector';
import VerticalTabSelector from '../../InputPopover/vertical-tab-selector';

interface BarrierTypeSelectorProps {
    selectedType: string;
    onSelectType: (type: string) => void;
    className?: string;
}

const BarrierTypeSelector: React.FC<BarrierTypeSelectorProps> = ({ selectedType, onSelectType, className }) => {
    const BARRIER_TYPES: VerticalTabItem[] = useMemo(
        () => [
            { value: 'above_spot', label: localize('Above spot') },
            { value: 'below_spot', label: localize('Below spot') },
            { value: 'fixed_barrier', label: localize('Fixed barrier') },
        ],
        []
    );

    return (
        <VerticalTabSelector
            items={BARRIER_TYPES}
            selectedValue={selectedType}
            onSelect={onSelectType}
            className={className}
        />
    );
};

export default BarrierTypeSelector;
