import FIREBASE_INIT_DATA from '@deriv/api/src/remote_config.json';
import { Analytics } from '@deriv-com/analytics';

import initDatadog from 'Utils/Datadog';

import { FeatureFlags, isFeatureFlags } from '../../types/feature-flags';

/**
 * Fetches remote configuration with proper error handling and logging
 */
const fetchRemoteConfig = async (url: string): Promise<FeatureFlags> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate the response structure
        if (!isFeatureFlags(data)) {
            throw new Error('Invalid feature flags structure received from remote config');
        }

        return data;
    } catch (error) {
        // Remote config fetch failed, fall back to local config
        // This is expected during development or when remote config is unavailable
        return FIREBASE_INIT_DATA as FeatureFlags;
    }
};

export const AnalyticsInitializer = async () => {
    if (!process.env.REMOTE_CONFIG_URL) {
        return;
    }

    const flags = await fetchRemoteConfig(process.env.REMOTE_CONFIG_URL);

    // Initialize RudderStack and/or PostHog based on feature flags
    // Note: posthogKey and posthogHost are supported in @deriv-com/analytics v1.33.0+
    const hasRudderStack = !!(process.env.RUDDERSTACK_KEY && flags.tracking_rudderstack);
    const hasPostHog = !!(process.env.POSTHOG_KEY && flags.tracking_posthog);

    // RudderStack key is required by the Analytics package
    if (hasRudderStack) {
        const config: {
            rudderstackKey: string;
            posthogKey?: string;
            posthogHost?: string;
        } = {
            rudderstackKey: process.env.RUDDERSTACK_KEY!,
        };

        if (hasPostHog) {
            config.posthogKey = process.env.POSTHOG_KEY;
            config.posthogHost = process.env.POSTHOG_HOST;
        }

        await Analytics?.initialise(config);
    }

    // Initialize DataDog if enabled (synchronous call)
    if (flags.tracking_datadog) {
        initDatadog(true);
    }
};
