import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, TextField, TextFieldAddon } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

interface BarrierContentDesktopProps {
    barrierType: string;
    onClose: () => void;
}

const BarrierContentDesktop: React.FC<BarrierContentDesktopProps> = observer(({ barrierType, onClose }) => {
    const { barrier_1, onChange, tick_data } = useTraderStore();
    const getInitialValue = () => {
        if (!barrier_1) return '';
        if (barrierType === 'above_spot' || barrierType === 'below_spot') {
            return barrier_1.replace(/^[+-]/, '');
        }
        return barrier_1;
    };
    const [inputValue, setInputValue] = useState(getInitialValue());

    const { pip_size, quote } = tick_data ?? {};

    const handleSave = () => {
        let newValue = inputValue;
        if (barrierType === 'above_spot') {
            newValue = `+${inputValue}`;
        } else if (barrierType === 'below_spot') {
            newValue = `-${inputValue}`;
        }
        onChange({ target: { name: 'barrier_1', value: newValue } });
        onClose();
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    return (
        <div className='barrier-content'>
            <div className='barrier-content__spot'>
                <span className='barrier-content__spot-label'>
                    <Localize i18n_default_text='Current spot' />
                </span>
                <span className='barrier-content__spot-value'>{quote ?? '0.0000'}</span>
            </div>

            <div className='barrier-content__input'>
                {barrierType === 'fixed_barrier' ? (
                    <TextField
                        customType='commaRemoval'
                        name='barrier_1'
                        noStatusIcon
                        value={inputValue}
                        allowDecimals
                        decimals={pip_size}
                        allowSign={false}
                        inputMode='decimal'
                        regex={/[^0-9.,]/g}
                        textAlignment='center'
                        onChange={handleOnChange}
                        placeholder={quote?.toString() || '0.0000'}
                        variant='fill'
                    />
                ) : (
                    <TextFieldAddon
                        fillAddonBorderColor='var(--semantic-color-slate-solid-surface-frame-mid)'
                        customType='commaRemoval'
                        name='barrier_1'
                        noStatusIcon
                        addonLabel={barrierType === 'above_spot' ? '+' : '-'}
                        decimals={pip_size}
                        value={inputValue}
                        allowDecimals
                        inputMode='decimal'
                        allowSign={false}
                        onChange={handleOnChange}
                        placeholder={localize('Distance to spot')}
                        regex={/[^0-9.,]/g}
                        variant='fill'
                    />
                )}
            </div>

            <div className='barrier-content__actions'>
                <Button
                    fullWidth
                    size='lg'
                    variant='primary'
                    color='black-white'
                    onClick={handleSave}
                    className='barrier-content__save-button'
                    label={localize('Save')}
                />
            </div>
        </div>
    );
});

export default BarrierContentDesktop;
