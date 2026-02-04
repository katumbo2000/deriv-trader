import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv-com/translations';

import { TRADE_PARAMETER_PRESETS } from 'AppV2/Config/trade-parameter-presets';
import { useTraderStore } from 'Stores/useTraderStores';

import { TabSelector } from '../../InputPopover';
import { ChipsWithInputToggle } from '../Shared';
import TradeParameterPopover, { useTradeParameterPopover } from '../Shared/TradeParameterPopover';

import DurationEndDateDesktop from './duration-end-date-desktop';
import DurationEndTimeDesktop from './duration-end-time-desktop';
import DurationHoursInputDesktop from './duration-hours-input-desktop';
import DurationInputDesktop from './duration-input-desktop';
import DurationTicksInputDesktop from './duration-ticks-input-desktop';
import DurationUnitSelector from './duration-unit-selector';

interface DurationDesktopProps {
    is_minimized?: boolean;
}

type DurationConfig = {
    chipValues: number[] | string[];
    selectedValue: number | string;
    onSelect: (value: number | string) => void;
    formatValue: (value: number | string) => string;
    inputComponent: React.ReactNode;
};

const DurationPopoverContent: React.FC<{
    selectedUnit: string;
    activeTab: 'chips' | 'input';
    selectedDuration: number;
    availableUnits: string[];
    onDurationSelect: (value: number) => void;
    onHourSelect: (hours: number) => void;
    onEndTimeSelect: (time: string) => void;
    onEndDateSelect: (days: number) => void;
    onUnitSelect: (unit: string) => void;
    onTabChange: (tab: 'chips' | 'input') => void;
    formatTickValue: (value: number) => string;
    formatSecondsValue: (value: number) => string;
    formatMinutesValue: (value: number) => string;
    formatHoursValue: (value: number) => string;
    formatEndTimeValue: (value: string) => string;
    formatEndDateValue: (value: number) => string;
}> = ({
    selectedUnit,
    activeTab,
    selectedDuration,
    availableUnits,
    onDurationSelect,
    onHourSelect,
    onEndTimeSelect,
    onEndDateSelect,
    onUnitSelect,
    onTabChange,
    formatTickValue,
    formatSecondsValue,
    formatMinutesValue,
    formatHoursValue,
    formatEndTimeValue,
    formatEndDateValue,
}) => {
    const { closePopover } = useTradeParameterPopover();

    // Safety check: If config is null, automatically switch to a valid unit
    React.useEffect(() => {
        const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];
        if (!validUnits.includes(selectedUnit)) {
            // Find first valid unit from available units
            const firstValid = availableUnits.find(unit => validUnits.includes(unit));
            if (firstValid && firstValid !== selectedUnit) {
                onUnitSelect(firstValid);
            }
        }
    }, [selectedUnit, availableUnits, onUnitSelect]);

    const handleDurationSelectAndClose = useCallback(
        (value: number) => {
            onDurationSelect(value);
            closePopover();
        },
        [onDurationSelect, closePopover]
    );

    const handleHourSelectAndClose = useCallback(
        (hours: number) => {
            onHourSelect(hours);
            closePopover();
        },
        [onHourSelect, closePopover]
    );

    const handleEndTimeSelectAndClose = useCallback(
        (time: string) => {
            onEndTimeSelect(time);
            closePopover();
        },
        [onEndTimeSelect, closePopover]
    );

    const handleEndDateSelectAndClose = useCallback(
        (days: number) => {
            onEndDateSelect(days);
            closePopover();
        },
        [onEndDateSelect, closePopover]
    );

    // Helper function to check if a unit has a valid config
    const hasValidConfig = useCallback((unit: string): boolean => {
        const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];
        return validUnits.includes(unit);
    }, []);

    const config = useMemo(() => {
        const configs: Record<string, DurationConfig | null> = {
            t: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.ticks,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose as (value: number | string) => void,
                formatValue: formatTickValue as (value: number | string) => string,
                inputComponent: <DurationTicksInputDesktop onClose={closePopover} />,
            },
            s: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.seconds,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose as (value: number | string) => void,
                formatValue: formatSecondsValue as (value: number | string) => string,
                inputComponent: <DurationInputDesktop unit='s' onClose={closePopover} />,
            },
            m: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.minutes,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose as (value: number | string) => void,
                formatValue: formatMinutesValue as (value: number | string) => string,
                inputComponent: <DurationInputDesktop unit='m' onClose={closePopover} />,
            },
            h: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.hours,
                selectedValue: Math.floor(selectedDuration / 60),
                onSelect: handleHourSelectAndClose as (value: number | string) => void,
                formatValue: formatHoursValue as (value: number | string) => string,
                inputComponent: <DurationHoursInputDesktop onClose={closePopover} />,
            },
            end_time: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.endTime,
                selectedValue: TRADE_PARAMETER_PRESETS.duration.endTime[0],
                onSelect: handleEndTimeSelectAndClose as (value: number | string) => void,
                formatValue: formatEndTimeValue as (value: number | string) => string,
                inputComponent: <DurationEndTimeDesktop onClose={closePopover} />,
            },
            end_date: {
                chipValues: TRADE_PARAMETER_PRESETS.duration.endDate,
                selectedValue: selectedDuration,
                onSelect: handleEndDateSelectAndClose as (value: number | string) => void,
                formatValue: formatEndDateValue as (value: number | string) => string,
                inputComponent: <DurationEndDateDesktop onClose={closePopover} />,
            },
        };
        return configs[selectedUnit] || null;
    }, [
        selectedUnit,
        selectedDuration,
        handleDurationSelectAndClose,
        handleHourSelectAndClose,
        handleEndTimeSelectAndClose,
        handleEndDateSelectAndClose,
        formatTickValue,
        formatSecondsValue,
        formatMinutesValue,
        formatHoursValue,
        formatEndTimeValue,
        formatEndDateValue,
        closePopover,
    ]);

    const hasOnlyOneUnit = availableUnits.length === 1;

    // Check if presets are disabled for the current unit
    const presetsDisabled = TRADE_PARAMETER_PRESETS.durationConfig.disabledPresets.includes(selectedUnit);

    return (
        <div className={`duration-popover__layout ${hasOnlyOneUnit ? 'duration-popover__layout--single-unit' : ''}`}>
            {!hasOnlyOneUnit && (
                <div className='duration-popover__sidebar'>
                    <DurationUnitSelector
                        selectedUnit={selectedUnit}
                        onSelectUnit={onUnitSelect}
                        availableUnits={availableUnits}
                    />
                </div>
            )}
            <div className='duration-popover__main'>
                {config && !presetsDisabled && (
                    <div className='duration-popover__header'>
                        <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
                    </div>
                )}
                <div className='duration-popover__content'>
                    {config ? (
                        presetsDisabled ? (
                            config.inputComponent
                        ) : (
                            <ChipsWithInputToggle
                                activeTab={activeTab}
                                chipValues={config.chipValues as number[]}
                                selectedValue={config.selectedValue as number}
                                onSelect={config.onSelect as (value: number) => void}
                                formatValue={config.formatValue as (value: number) => string}
                                inputComponent={config.inputComponent}
                            />
                        )
                    ) : (
                        <div className='duration-popover__coming-soon'>
                            <Text size='md' color='quill-typography-default'>
                                <Localize i18n_default_text='Coming soon' />
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DurationDesktop: React.FC<DurationDesktopProps> = observer(({ is_minimized }) => {
    const {
        duration,
        duration_unit,
        duration_units_list,
        onChangeMultiple,
        is_market_closed,
        expiry_type,
        expiry_time,
        expiry_date,
    } = useTraderStore();

    const availableUnits = React.useMemo(() => {
        const units = duration_units_list.map(unit => unit.value);
        // Add end_time and end_date for contracts that support them
        // (they're expiry types, not duration units, so they're not in duration_units_list)
        // Match mobile behavior: only show end_time/end_date when duration_units_list.length > 1
        // This ensures forex markets (or any market with only 1 duration unit) don't show end time option
        // HOWEVER: If the current state is using end_time or end_date, we must include them
        // regardless of duration_units_list.length to avoid breaking the modal
        const show_end_time = duration_units_list.length > 1;
        const is_currently_using_end_time = expiry_type === 'endtime' && expiry_time && !expiry_date;
        const is_currently_using_end_date = expiry_type === 'endtime' && expiry_date;
        // Special case: 'd' (days) is a duration_unit that represents end_date
        const is_currently_using_days = duration_unit === 'd';

        // Add end_time only when appropriate (NOT when using days)
        if ((show_end_time || is_currently_using_end_time) && !is_currently_using_days) {
            if (!units.includes('end_time')) {
                units.push('end_time');
            }
        }

        // Add end_date when using end_date expiry type OR when using days duration unit
        if (show_end_time || is_currently_using_end_date || is_currently_using_days) {
            if (!units.includes('end_date')) {
                units.push('end_date');
            }
        }
        return units;
    }, [duration_units_list, expiry_type, expiry_time, expiry_date, duration_unit]);

    const popoverWidth = React.useMemo(() => {
        // Use narrower width for single-unit contracts (like digit contracts)
        return availableUnits.length === 1 ? 280 : 360;
    }, [availableUnits]);

    // Initialize selectedUnit based on current duration_unit or first available unit
    // If duration_unit is an expiry type (like 'endtime'), default to first available unit
    // [AI]
    // Helper function to get the first valid unit from available units
    const getFirstValidUnit = React.useCallback((units: string[]): string => {
        const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];
        const firstValid = units.find(unit => validUnits.includes(unit));
        return firstValid || 't'; // Fallback to 't' if no valid unit found
    }, []);

    const getInitialUnit = React.useCallback(() => {
        // Special case: 'd' (days) maps to 'end_date'
        if (duration_unit === 'd') {
            return 'end_date';
        }
        // Check if current duration_unit is in available units AND has a valid config
        if (availableUnits.includes(duration_unit)) {
            const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];
            if (validUnits.includes(duration_unit)) {
                return duration_unit;
            }
        }
        // If expiry_type is 'endtime', check if we should use end_time or end_date
        if (expiry_type === 'endtime') {
            if (expiry_time && !expiry_date) {
                return 'end_time';
            }
            if (expiry_date) {
                return 'end_date';
            }
        }
        // Default to first valid unit from available units
        return getFirstValidUnit(availableUnits);
    }, [duration_unit, expiry_type, expiry_time, expiry_date, availableUnits, getFirstValidUnit]);

    const [selectedUnit, setSelectedUnit] = useState(() => getInitialUnit());
    // [/AI]
    const [selectedDuration, setSelectedDuration] = useState(duration);
    const [activeTab, setActiveTab] = useState<'chips' | 'input'>('chips');

    const handleOpenPopover = useCallback(() => {
        // Use the same logic as getInitialUnit to determine which unit to show
        let unitToShow = duration_unit;
        const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];

        // Special case: 'd' (days) maps to 'end_date'
        if (duration_unit === 'd') {
            unitToShow = 'end_date';
        }
        // If duration_unit is not in available units (e.g., it's an expiry type)
        else if (!availableUnits.includes(duration_unit)) {
            // If expiry_type is 'endtime', check if we should use end_time or end_date
            if (expiry_type === 'endtime') {
                if (expiry_time && !expiry_date) {
                    unitToShow = 'end_time';
                } else if (expiry_date) {
                    unitToShow = 'end_date';
                }
            } else {
                // Default to first valid unit from available units
                unitToShow = getFirstValidUnit(availableUnits);
            }
        } else if (!validUnits.includes(duration_unit)) {
            // If duration_unit is in available units but doesn't have a valid config
            unitToShow = getFirstValidUnit(availableUnits);
        }

        setSelectedUnit(unitToShow);
        setSelectedDuration(duration);
        setActiveTab('chips'); // Always start with chips tab
    }, [duration, duration_unit, expiry_type, expiry_time, expiry_date, availableUnits, getFirstValidUnit]);

    const handleClosePopover = useCallback(() => {
        setActiveTab('chips'); // Reset to chips tab on close
    }, []);

    const handleUnitSelect = useCallback(
        (unit: string) => {
            // Validate that the selected unit has a valid config
            const validUnits = ['t', 's', 'm', 'h', 'end_time', 'end_date'];

            if (validUnits.includes(unit)) {
                // Unit has a valid config, proceed with selection
                setSelectedUnit(unit);
                setActiveTab('chips'); // Reset to chips tab when changing units
            } else {
                // Unit doesn't have a valid config, fallback to first valid unit
                const fallbackUnit = getFirstValidUnit(availableUnits);
                setSelectedUnit(fallbackUnit);
                setActiveTab('chips');
            }
        },
        [availableUnits, getFirstValidUnit]
    );

    const handleTabChange = useCallback((tab: 'chips' | 'input') => {
        setActiveTab(tab);
    }, []);

    const handleDurationSelect = useCallback(
        (value: number) => {
            setSelectedDuration(value);
            // Apply the change immediately based on selected unit
            onChangeMultiple({
                duration_unit: selectedUnit,
                duration: value,
                expiry_type: 'duration',
            });
        },
        [selectedUnit, onChangeMultiple]
    );

    const handleHourSelect = useCallback(
        (hours: number) => {
            const totalMinutes = hours * 60;
            setSelectedDuration(totalMinutes);
            // Save as minutes
            onChangeMultiple({
                duration_unit: 'm',
                duration: totalMinutes,
                expiry_type: 'duration',
            });
        },
        [onChangeMultiple]
    );

    const formatTickValue = useCallback((value: number) => {
        return localize('{{count}} {{tick_label}}', {
            count: value,
            tick_label: value === 1 ? localize('tick') : localize('ticks'),
        });
    }, []);

    const formatSecondsValue = useCallback((value: number) => {
        return localize('{{count}} {{second_label}}', {
            count: value,
            second_label: localize('sec'),
        });
    }, []);

    const formatMinutesValue = useCallback((value: number) => {
        return localize('{{count}} {{minute_label}}', {
            count: value,
            minute_label: localize('min'),
        });
    }, []);

    const formatHoursValue = useCallback((value: number) => {
        return localize('{{count}} hr', {
            count: value,
        });
    }, []);

    const formatEndTimeValue = useCallback((value: string) => {
        return value; // Time is already formatted as HH:MM
    }, []);

    const formatEndDateValue = useCallback((value: number) => {
        const date = new Date();
        date.setDate(date.getDate() + value);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return `${day} ${month}`;
    }, []);

    const handleEndTimeSelect = useCallback(
        (time: string) => {
            onChangeMultiple({
                expiry_type: 'endtime',
                expiry_time: time,
            });
        },
        [onChangeMultiple]
    );

    const handleEndDateSelect = useCallback(
        (days: number) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            const formattedDate = date.toISOString().split('T')[0];
            onChangeMultiple({
                expiry_type: 'endtime',
                expiry_date: formattedDate,
            });
        },
        [onChangeMultiple]
    );

    const getDisplayValue = useCallback(() => {
        if (expiry_type === 'endtime') {
            if (expiry_time && expiry_date) {
                const date = moment(expiry_date);
                const formattedDate = date.format('D MMM');
                const formattedTime = expiry_time.substring(0, 5);
                return `${formattedDate}, ${formattedTime}`;
            }
            if (expiry_date) {
                const date = moment(expiry_date);
                const formattedDate = date.format('D MMM');
                return formattedDate;
            }
        }

        if (duration_unit === 't') {
            return formatTickValue(duration);
        }
        if (duration_unit === 's') {
            return formatSecondsValue(duration);
        }
        if (duration_unit === 'm') {
            // Check if this is hours (stored as minutes)
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;

            // If it's a whole hour value (no remainder), display as hours
            if (minutes === 0 && hours > 0) {
                return localize('{{count}} {{hour_label}}', {
                    count: hours,
                    hour_label: hours === 1 ? localize('hour') : localize('hours'),
                });
            }
            // If it has both hours and minutes
            if (hours > 0 && minutes > 0) {
                return localize('{{hours_count}} {{hour_label}} {{minutes_count}} {{minute_label}}', {
                    hours_count: hours,
                    hour_label: hours === 1 ? localize('hour') : localize('hours'),
                    minutes_count: minutes,
                    minute_label: minutes === 1 ? localize('minute') : localize('minutes'),
                });
            }
            // Otherwise display as minutes
            return formatMinutesValue(duration);
        }
        if (duration_unit === 'd') {
            // Calculate expiry date by adding duration days to current date
            const expiryDate = moment().add(duration, 'days');
            // Set time to 23:59 (end of day)
            expiryDate.set({ hour: 23, minute: 59 });
            // Format as "D MMM, HH:MM" (e.g., "6 Feb, 23:59")
            const formattedDate = expiryDate.format('D MMM');
            const formattedTime = expiryDate.format('HH:mm');
            return `${formattedDate}, ${formattedTime}`;
        }
        return `${duration} ${duration_unit}`;
    }, [
        duration,
        duration_unit,
        expiry_type,
        expiry_time,
        expiry_date,
        formatTickValue,
        formatSecondsValue,
        formatMinutesValue,
    ]);

    return (
        <TradeParameterPopover
            popoverWidth={popoverWidth}
            label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
            is_minimized={is_minimized}
            disabled={is_market_closed}
            popover_classname='duration-popover'
            value={getDisplayValue()}
            onOpen={handleOpenPopover}
            onClose={handleClosePopover}
        >
            <DurationPopoverContent
                selectedUnit={selectedUnit}
                activeTab={activeTab}
                selectedDuration={selectedDuration}
                availableUnits={availableUnits}
                onDurationSelect={handleDurationSelect}
                onHourSelect={handleHourSelect}
                onEndTimeSelect={handleEndTimeSelect}
                onEndDateSelect={handleEndDateSelect}
                onUnitSelect={handleUnitSelect}
                onTabChange={handleTabChange}
                formatTickValue={formatTickValue}
                formatSecondsValue={formatSecondsValue}
                formatMinutesValue={formatMinutesValue}
                formatHoursValue={formatHoursValue}
                formatEndTimeValue={formatEndTimeValue}
                formatEndDateValue={formatEndDateValue}
            />
        </TradeParameterPopover>
    );
});

export default DurationDesktop;
