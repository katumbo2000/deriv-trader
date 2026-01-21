import React, { useCallback, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { Button, TextField } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';

import { InputPopover } from 'AppV2/Components/InputPopover';
import { useTraderStore } from 'Stores/useTraderStores';

import TimeGridPicker from './time-grid-picker';

import './time-grid-picker.scss';
import './duration-end-time-desktop.scss';

interface DurationEndTimeDesktopProps {
    onClose: () => void;
}

const DurationEndTimeDesktop: React.FC<DurationEndTimeDesktopProps> = observer(({ onClose }) => {
    const { localize } = useTranslations();
    const { expiry_time, expiry_date, market_open_times, onChangeMultiple } = useTraderStore();

    const [selectedTime, setSelectedTime] = useState(expiry_time || '09:30');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const field_ref = useRef<HTMLDivElement>(null);

    // Get start and end times from market_open_times or use defaults
    const start_times =
        market_open_times?.length > 0
            ? market_open_times.map((time: string) => moment(time, 'HH:mm'))
            : [moment().add(5, 'minutes')];

    const end_times =
        market_open_times?.length > 0
            ? market_open_times.map((time: string) => moment(time, 'HH:mm').add(1, 'day'))
            : [moment().add(1, 'day').hour(23).minute(59)];

    const handleTimeClick = useCallback(() => {
        setIsPickerOpen(true);
        // Reset date to today when opening the time picker
        const todayDate = moment().format('YYYY-MM-DD');
        onChangeMultiple({
            expiry_date: todayDate,
        });
    }, [onChangeMultiple]);

    const handleTimeChange = useCallback((time: string) => {
        setSelectedTime(time);
    }, []);

    const handlePickerClose = useCallback(() => {
        setIsPickerOpen(false);
    }, []);

    const handleSave = useCallback(() => {
        const todayDate = moment().format('YYYY-MM-DD');
        onChangeMultiple({
            expiry_type: 'endtime',
            expiry_time: selectedTime,
            expiry_date: todayDate,
        });
        onClose();
    }, [selectedTime, onChangeMultiple, onClose]);

    // Calculate expiry date message
    const getExpiryMessage = useCallback(() => {
        const todayMoment = moment();
        const formattedDate = todayMoment.format('Do MMM');
        return localize('Contract will expire on {{formatted_date}} at the selected time GMT.', {
            formatted_date: formattedDate,
        });
    }, [localize]);

    return (
        <div className='duration-input-desktop__wrapper'>
            <div ref={field_ref}>
                <TextField
                    label={localize('End time')}
                    name='end_time'
                    value={selectedTime}
                    onClick={handleTimeClick}
                    readOnly
                    variant='fill'
                    status='neutral'
                    noStatusIcon
                    data-testid='dt_duration_end_time_input_desktop'
                />
            </div>
            <div className='duration-end-time-desktop__message'>{getExpiryMessage()}</div>

            <InputPopover
                isOpen={isPickerOpen}
                onClose={handlePickerClose}
                triggerRef={field_ref}
                className='duration-end-time-desktop__popover'
                popoverWidth={321}
                placement='bottom'
                spacing={4}
            >
                <div className='duration-end-time-desktop__picker-wrapper'>
                    <TimeGridPicker
                        selectedTime={selectedTime}
                        onTimeChange={handleTimeChange}
                        startTimes={start_times}
                        endTimes={end_times}
                    />
                </div>
            </InputPopover>
            <div className='duration-input-desktop__footer'>
                <Button
                    size='lg'
                    color='black-white'
                    variant='primary'
                    fullWidth
                    onClick={handleSave}
                    className='duration-input-desktop__save-button'
                >
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        </div>
    );
});

export default DurationEndTimeDesktop;
