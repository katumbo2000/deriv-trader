// eslint-disable-next-line import/no-relative-packages
import config_data from '../../../../../brand.config.json';
import { appendLangParam } from '../url/helpers';

/**
 * Checks if the current environment should be treated as production.
 * Returns true if NODE_ENV is 'production' OR if the runtime hostname is the beta platform.
 */
const isProductionEnvironment = (): boolean => {
    if (process.env.NODE_ENV === 'production') return true;
    if (typeof window !== 'undefined') {
        return window.location.hostname === config_data.platform.hostname.beta;
    }
    return false;
};

export const getBrandDomain = () => {
    return config_data.brand_domain;
};

export const getBrandName = () => {
    return config_data.brand_name;
};

export const getBrandLogo = () => {
    return config_data.brand_logo;
};

export const getBrandHostname = () => {
    return isProductionEnvironment() ? config_data.brand_hostname.production : config_data.brand_hostname.staging;
};

export const getBrandUrl = () => {
    return isProductionEnvironment()
        ? `https://${config_data.brand_hostname.production}`
        : `https://${config_data.brand_hostname.staging}`;
};

export const getBrandHomeUrl = (language?: string) => {
    const baseUrl = `${getBrandUrl()}/home`;
    return appendLangParam(baseUrl, language);
};

export const getBrandLoginUrl = (language?: string) => {
    const baseUrl = `${getBrandUrl()}/login`;
    return appendLangParam(baseUrl, language);
};

export const getBrandSignupUrl = (language?: string) => {
    const baseUrl = `${getBrandUrl()}/signup`;
    return appendLangParam(baseUrl, language);
};

export const getPlatformName = () => {
    return config_data.platform.name;
};

export const getPlatformLogo = () => {
    return config_data.platform.logo;
};

export const getPlatformHostname = () => {
    if (typeof window !== 'undefined' && window.location.hostname === config_data.platform.hostname.beta) {
        return config_data.platform.hostname.beta;
    }
    if (isProductionEnvironment()) {
        return config_data.platform.hostname.production;
    } else if (process.env.NODE_ENV === 'staging') {
        return config_data.platform.hostname.staging;
    }
    if (typeof window !== 'undefined') {
        return window.location.host;
    }
    return config_data.platform.hostname.staging;
};

export const getProductionPlatformHostname = () => {
    return config_data.platform.hostname.production;
};

export const getStagingPlatformHostname = () => {
    return config_data.platform.hostname.staging;
};

export const getBetaPlatformHostname = () => {
    return config_data.platform.hostname.beta;
};

export const getPlatformUrl = () => {
    return isProductionEnvironment()
        ? `https://${config_data.platform.hostname.production}`
        : `https://${config_data.platform.hostname.staging}`;
};

export const getProductionPlatformUrl = () => {
    return `https://${config_data.platform.hostname.production}`;
};

export const getStagingPlatformUrl = () => {
    return `https://${config_data.platform.hostname.staging}`;
};

export const getDomainName = () => {
    // Split the hostname into parts
    const domainParts = window.location.hostname.split('.');

    // Ensure we have at least two parts (SLD and TLD)
    if (domainParts.length >= 2) {
        // Combine the SLD and TLD
        const domain = `${domainParts[domainParts.length - 2]}.${domainParts[domainParts.length - 1]}`;
        return domain;
    }

    return '';
};

/**
 * Gets the WebSocket server URL with base path
 * @param isProductionEnv - Whether the current environment is production
 * @returns WebSocket server URL with base path (e.g., "staging-core.api.deriv.com/options/v1/ws")
 */
export const getWebSocketURL = (isProductionEnv: boolean): string => {
    return isProductionEnv ? config_data.platform.websocket.production : config_data.platform.websocket.staging;
};

/**
 * Gets the whoami endpoint URL
 * @param isProductionEnv - Whether the current environment is production
 * @returns Whoami endpoint URL (e.g., "https://auth.deriv.com/sessions/whoami")
 */
export const getWhoAmIURL = (isProductionEnv: boolean): string => {
    return isProductionEnv
        ? config_data.platform.whoami_endpoint.production
        : config_data.platform.whoami_endpoint.staging;
};

/**
 * Gets the logout endpoint URL
 * @param isProductionEnv - Whether the current environment is production
 * @returns Logout endpoint URL (e.g., "https://auth.deriv.com/self-service/logout/browser")
 */
export const getLogoutURL = (isProductionEnv: boolean): string => {
    return isProductionEnv
        ? config_data.platform.logout_endpoint.production
        : config_data.platform.logout_endpoint.staging;
};

/**
 * Gets the API Core URL based on environment
 * @returns API Core base URL (without protocol)
 */
export const getApiCoreUrl = (): string => {
    return isProductionEnvironment() ? config_data.api_core.production : config_data.api_core.staging;
};

/**
 * Gets the full API Core URL with protocol
 * @returns Full API Core URL with https://
 */
export const getApiCoreBaseUrl = (): string => {
    return `https://${getApiCoreUrl()}`;
};

/**
 * Gets the Help Centre URL
 * @returns Help Centre URL (e.g., "https://trade.deriv.com/help-centre")
 */
export const getHelpCentreUrl = (): string => {
    return config_data.platform.help_centre_url;
};
