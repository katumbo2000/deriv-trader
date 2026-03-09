export interface FeatureFlags {
    /** Enable/disable Intercom chat support */
    cs_chat_intercom: boolean;

    /** Enable/disable WhatsApp chat support */
    cs_chat_whatsapp: boolean;
}

export function isFeatureFlags(obj: any): obj is FeatureFlags {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.cs_chat_intercom === 'boolean' &&
        typeof obj.cs_chat_whatsapp === 'boolean'
    );
}
