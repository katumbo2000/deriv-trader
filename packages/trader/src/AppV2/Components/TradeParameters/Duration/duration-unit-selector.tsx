import React, { useMemo } from 'react';

import { localize } from '@deriv-com/translations';

import type { VerticalTabItem } from '../../InputPopover/vertical-tab-selector';
import VerticalTabSelector from '../../InputPopover/vertical-tab-selector';

interface DurationUnitSelectorProps {
    selectedUnit: string;
    onSelectUnit: (unit: string) => void;
    className?: string;
}

const DurationUnitSelector: React.FC<DurationUnitSelectorProps> = ({ selectedUnit, onSelectUnit, className }) => {
    const DURATION_UNITS: VerticalTabItem[] = useMemo(
        () => [
            { value: 't', label: localize('Ticks') },
            { value: 's', label: localize('Seconds') },
            { value: 'm', label: localize('Minutes') },
            { value: 'h', label: localize('Hours') },
            { value: 'end_time', label: localize('End time') },
            { value: 'end_date', label: localize('End date') },
        ],
        []
    );

    return (
        <VerticalTabSelector
            items={DURATION_UNITS}
            selectedValue={selectedUnit}
            onSelect={onSelectUnit}
            className={className}
        />
    );
};

export default DurationUnitSelector;
