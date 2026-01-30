import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { useStore } from '@deriv/stores';
import {
    StandaloneChartAreaFillIcon,
    StandaloneChartAreaRegularIcon,
    StandaloneClockThreeFillIcon,
    StandaloneClockThreeRegularIcon,
} from '@deriv/quill-icons';
import { Badge } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';
import BottomNav from 'AppV2/Components/BottomNav';
import Router from '../../Routes/router';
import Sidebar from 'App/Components/Layout/Sidebar/sidebar';
import './app-shell.scss';

const AppShell = observer(() => {
    const { portfolio, client, ui } = useStore();
    const { is_logged_in } = client;
    const { active_positions_count } = portfolio;
    const { active_sidebar_flyout } = ui;
    const { isMobile } = useDevice();

    const bottomNavItems = [
        {
            icon: <StandaloneChartAreaRegularIcon iconSize='sm' />,
            activeIcon: <StandaloneChartAreaFillIcon iconSize='sm' />,
            label: <Localize i18n_default_text='Trade' />,
            path: routes.index,
        },
        {
            icon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                        className='bottom-nav-item__position-badge'
                    >
                        <StandaloneClockThreeRegularIcon iconSize='sm' />
                    </Badge>
                ) : (
                    <StandaloneClockThreeRegularIcon iconSize='sm' />
                ),
            activeIcon:
                active_positions_count > 0 ? (
                    <Badge
                        variant='notification'
                        position='top-right'
                        label={active_positions_count.toString()}
                        color='danger'
                        size='sm'
                        contentSize='sm'
                        className='bottom-nav-item__position-badge'
                    >
                        <StandaloneClockThreeFillIcon iconSize='sm' />
                    </Badge>
                ) : (
                    <StandaloneClockThreeFillIcon iconSize='sm' />
                ),
            label: (
                <React.Fragment>
                    <span className='user-guide__anchor' />
                    <Localize i18n_default_text='Positions' />
                </React.Fragment>
            ),
            path: routes.trader_positions,
        },
    ];

    const should_show_bottomnav = isMobile && is_logged_in && !window.location.pathname.startsWith('/contract');

    return (
        <div className='app-shell'>
            {!isMobile && <Sidebar />}
            <Router />
            {should_show_bottomnav && <BottomNav bottomNavItems={bottomNavItems} />}
        </div>
    );
});

export default AppShell;
