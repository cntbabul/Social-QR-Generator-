import { SocialMode } from './types';

export interface PlatformField {
    key: string;
    label: string;
    icon: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
}

export interface PlatformConfig {
    id: SocialMode;
    label: string;
    icon: string;
    gradient: readonly [string, string, ...string[]];
    color: string;
    fields: PlatformField[];
    generateLabel: string;
    generateIcon: string;
}

export const TABS: PlatformConfig[] = [
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: 'whatsapp',
        gradient: ['#25D366', '#128C7E'] as const,
        color: '#25D366',
        generateLabel: 'Generate WhatsApp QR',
        generateIcon: 'whatsapp',
        fields: [
            { 
                key: 'phoneNumber', 
                label: 'PHONE NUMBER', 
                icon: 'phone', 
                placeholder: 'Enter phone number', 
                keyboardType: 'phone-pad' 
            },
        ]
    },
    {
        id: 'instagram',
        label: 'Instagram',
        icon: 'instagram',
        gradient: ['#F58529', '#DD2A7B', '#8134AF'] as const,
        color: '#DD2A7B',
        generateLabel: 'Generate Instagram QR',
        generateIcon: 'instagram',
        fields: [
            { 
                key: 'username', 
                label: 'INSTAGRAM USERNAME', 
                icon: 'instagram', 
                placeholder: '@username', 
                autoCapitalize: 'none' 
            },
        ]
    },
    {
        id: 'twitter',
        label: 'Twitter/X',
        icon: 'twitter',
        gradient: ['#1DA1F2', '#0E71C8'] as const,
        color: '#1DA1F2',
        generateLabel: 'Generate Twitter/X QR',
        generateIcon: 'twitter',
        fields: [
            { 
                key: 'username', 
                label: 'TWITTER/X HANDLE', 
                icon: 'twitter', 
                placeholder: '@handle', 
                autoCapitalize: 'none' 
            },
        ]
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        icon: 'linkedin',
        gradient: ['#0077B5', '#005885'] as const,
        color: '#0077B5',
        generateLabel: 'Generate LinkedIn QR',
        generateIcon: 'linkedin',
        fields: [
            { 
                key: 'username', 
                label: 'LINKEDIN PROFILE ID', 
                icon: 'linkedin', 
                placeholder: 'e.g. john-doe-123', 
                autoCapitalize: 'none' 
            },
        ]
    },
    {
        id: 'github',
        label: 'GitHub',
        icon: 'github',
        gradient: ['#555555', '#24292E'] as const,
        color: '#cccccc',
        generateLabel: 'Generate GitHub QR',
        generateIcon: 'github',
        fields: [
            { 
                key: 'username', 
                label: 'GITHUB USERNAME', 
                icon: 'github', 
                placeholder: 'username', 
                autoCapitalize: 'none' 
            },
        ]
    },
    {
        id: 'facebook',
        label: 'Facebook',
        icon: 'facebook',
        gradient: ['#1877F2', '#0C63D4'] as const,
        color: '#1877F2',
        generateLabel: 'Generate Facebook QR',
        generateIcon: 'facebook',
        fields: [
            { 
                key: 'username', 
                label: 'FACEBOOK PROFILE ID/NAME', 
                icon: 'facebook', 
                placeholder: 'username or id', 
                autoCapitalize: 'none' 
            },
        ]
    },
    {
        id: 'email',
        label: 'Email',
        icon: 'email',
        gradient: ['#EA4335', '#C5221F'] as const,
        color: '#EA4335',
        generateLabel: 'Generate Email QR',
        generateIcon: 'email-plus',
        fields: [
            { 
                key: 'email', 
                label: 'EMAIL ADDRESS', 
                icon: 'email', 
                placeholder: 'name@example.com', 
                keyboardType: 'email-address', 
                autoCapitalize: 'none' 
            },
            { 
                key: 'subject', 
                label: 'SUBJECT (OPTIONAL)', 
                icon: 'format-title', 
                placeholder: 'Enter subject' 
            },
            { 
                key: 'body', 
                label: 'BODY (OPTIONAL)', 
                icon: 'text', 
                placeholder: 'Enter email content...', 
                multiline: true 
            },
        ]
    },
];

export const COUNTRY_CODES = [
    { label: 'India (+91)', value: '91' },
    { label: 'USA/Canada (+1)', value: '1' },
    { label: 'UK (+44)', value: '44' },
    { label: 'Australia (+61)', value: '61' },
    { label: 'UAE (+971)', value: '971' },
    { label: 'Germany (+49)', value: '49' },
    { label: 'France (+33)', value: '33' },
    { label: 'Japan (+81)', value: '81' },
    { label: 'China (+86)', value: '86' },
];
