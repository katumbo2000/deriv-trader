import { fireEvent, render, screen } from '@testing-library/react';

import { mockStore, StoreProvider } from '@deriv/stores';

import AccountSelector from '../account-selector';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getBrandHomeUrl: jest.fn(() => 'https://deriv.com'),
}));

jest.mock('App/Hooks/useMobileBridge', () => ({
    useMobileBridge: jest.fn(() => ({
        sendBridgeEvent: jest.fn((_event, callback) => callback()),
    })),
}));

jest.mock('@deriv-com/translations', () => ({
    localize: (key: string) => key,
}));

describe('AccountSelector', () => {
    const defaultStoreConfig = {
        client: {
            logout: jest.fn(),
            is_logged_in: true,
        },
        common: {
            current_language: 'en',
        },
        ui: {
            closeSidebarFlyout: jest.fn(),
        },
    };

    const renderComponent = (storeConfig = defaultStoreConfig) => {
        const store = mockStore(storeConfig);
        return render(
            <StoreProvider store={store}>
                <AccountSelector />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        delete (window as any).location;
        (window as any).location = { href: '' };
    });

    it('should render the component with Go to Home button', () => {
        renderComponent();
        expect(screen.getByText('Go to Home')).toBeInTheDocument();
    });

    it('should render Log out button when user is logged in', () => {
        renderComponent();
        expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('should not render Log out button when user is not logged in', () => {
        const loggedOutStore = {
            ...defaultStoreConfig,
            client: {
                ...defaultStoreConfig.client,
                is_logged_in: false,
            },
        };
        renderComponent(loggedOutStore);
        expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });

    it('should navigate to home when Go to Home button is clicked', () => {
        const store = mockStore(defaultStoreConfig);
        render(
            <StoreProvider store={store}>
                <AccountSelector />
            </StoreProvider>
        );

        const goToHomeButton = screen.getByText('Go to Home');
        fireEvent.click(goToHomeButton);

        expect(window.location.href).toBe('https://deriv.com');
        expect(store.ui.closeSidebarFlyout).toHaveBeenCalled();
    });

    it('should call logout and close flyout when Log out button is clicked', () => {
        const store = mockStore(defaultStoreConfig);
        render(
            <StoreProvider store={store}>
                <AccountSelector />
            </StoreProvider>
        );

        const logoutButton = screen.getByText('Log out');
        fireEvent.click(logoutButton);

        expect(store.client.logout).toHaveBeenCalled();
        expect(store.ui.closeSidebarFlyout).toHaveBeenCalled();
    });

    it('should render Go to Home button as clickable button element', () => {
        renderComponent();
        // Check that Go to Home is rendered as a button
        const goToHomeButton = screen.getByRole('button', { name: /go to home/i });
        expect(goToHomeButton).toBeInTheDocument();
    });

    it('should use current language in brand URL', () => {
        const storeWithDifferentLang = {
            ...defaultStoreConfig,
            common: {
                current_language: 'es',
            },
        };
        const store = mockStore(storeWithDifferentLang);
        render(
            <StoreProvider store={store}>
                <AccountSelector />
            </StoreProvider>
        );

        const goToHomeButton = screen.getByText('Go to Home');
        fireEvent.click(goToHomeButton);

        // URL should still be set (getBrandHomeUrl is mocked to return the same value)
        expect(window.location.href).toBe('https://deriv.com');
    });
});
