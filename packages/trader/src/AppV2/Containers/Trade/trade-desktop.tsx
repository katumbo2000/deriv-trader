import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@deriv/stores';
import { Loading } from '@deriv/components';
import { getSymbolDisplayName, trackAnalyticsEvent } from '@deriv/shared';
import { useLocalStorageData } from '@deriv/api';
import { useTraderStore } from 'Stores/useTraderStores';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import { getChartHeight } from 'AppV2/Utils/layout-utils';
import { TradeParametersContainer, TradeParameters } from 'AppV2/Components/TradeParameters';
import CurrentSpot from 'AppV2/Components/CurrentSpot';
import { TradeChart } from '../Chart';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import TradeTypes from './trade-types';
import MarketSelector from 'AppV2/Components/MarketSelector';
import useContractsFor from 'AppV2/Hooks/useContractsFor';
import useDefaultSymbol from 'AppV2/Hooks/useDefaultSymbol';
import AccumulatorStats from 'AppV2/Components/AccumulatorStats';
import OnboardingGuide from 'AppV2/Components/OnboardingGuide/GuideForPages';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import AccountHeader from 'AppV2/Components/AccountHeader';

const TradeDesktop = observer(() => {
    const chart_ref = React.useRef<HTMLDivElement>(null);
    const {
        client,
        common: { current_language, network_status },
        ui: { is_dark_mode_on },
    } = useStore();
    const { is_logged_in } = client;
    const {
        active_symbols,
        contract_type,
        has_cancellation,
        is_accumulator,
        is_multiplier,
        is_market_closed,
        onChange,
        onMount,
        onUnmount,
        symbol,
        proposal_info,
        trade_types: trade_types_store,
        trade_type_tab,
    } = useTraderStore();
    const { trade_types } = useContractsFor();
    useDefaultSymbol(); // This will initialize and set the default symbol
    const [guide_dtrader_v2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });

    // For handling edge cases of snackbar:
    const contract_types = getDisplayedContractTypes(trade_types_store, contract_type, trade_type_tab);
    const is_all_types_with_errors = contract_types.every(item => proposal_info?.[item]?.has_error);
    const is_any_type_with_errors = contract_types.some(item => proposal_info?.[item]?.has_error);
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());

    // Showing snackbar for all cases, except when it is Rise/Fall or Digits and only one subtype has error
    const should_show_snackbar =
        contract_types.length === 1 ||
        is_multiplier ||
        is_all_types_with_errors ||
        (is_high_low && is_any_type_with_errors);

    const symbols = React.useMemo(
        () =>
            active_symbols.map(({ underlying_symbol: underlying }) => ({
                text: getSymbolDisplayName(underlying || ''),
                value: underlying || '',
            })),
        [active_symbols]
    );

    const onTradeTypeSelect = React.useCallback(
        (
            e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
            subform_name: string,
            trade_type_count: number
        ) => {
            const selected_trade_type = trade_types.find(
                ({ text }) => text === (e.target as HTMLButtonElement).textContent
            );
            onChange({
                target: {
                    name: 'contract_type',
                    value: selected_trade_type?.value,
                },
            });
            trackAnalyticsEvent('ce_trade_types_form_v2', {
                action: 'select_trade_type',
                trade_type_name: selected_trade_type?.text || '',
            });
        },
        [trade_types, onChange, symbol]
    );

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current_language, network_status.class]);

    return (
        <div
            className={clsx('trade', {
                trade__logout: !is_logged_in,
            })}
        >
            {symbols.length && trade_types.length ? (
                <React.Fragment>
                    <div className='trade-container__header'>
                        <TradeTypes
                            contract_type={contract_type}
                            onTradeTypeSelect={onTradeTypeSelect}
                            trade_types={trade_types}
                            is_dark_mode_on={is_dark_mode_on}
                        />
                        <AccountHeader />
                    </div>
                    <div className='trade-container__grid'>
                        <div className='trade-container__chart-tooltip'>
                            {isDigitTradeType(contract_type) && <CurrentSpot />}
                            <section
                                className={clsx('trade-container__chart', {
                                    'trade-container__chart--with-borderRadius': !is_accumulator,
                                })}
                                style={{
                                    height: '100%',
                                }}
                                ref={chart_ref}
                            >
                                <TradeChart />
                            </section>
                            {is_accumulator && <AccumulatorStats />}
                        </div>
                        <TradeParametersContainer>
                            <TradeParameters />
                            {!is_market_closed && <PurchaseButton />}
                        </TradeParametersContainer>
                    </div>
                    {!guide_dtrader_v2?.trade_page && is_logged_in && <OnboardingGuide type='trade_page' />}
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
        </div>
    );
});

export default TradeDesktop;
