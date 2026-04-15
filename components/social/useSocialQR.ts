import { useState, useRef, useCallback } from 'react';
import { Alert, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { captureRef } from 'react-native-view-shot';
import { SocialMode } from './types';

export function useSocialQR() {
    // Fields state: Record<PlatformID, Record<FieldKey, Value>>
    const [fields, setFields] = useState<Partial<Record<SocialMode, Record<string, string>>>>({
        whatsapp: { countryCode: '91', phoneNumber: '', customMessage: '' },
        instagram: { username: '', customMessage: '' },
        twitter: { username: '', customMessage: '' },
        linkedin: { username: '', customMessage: '' },
        github: { username: '', customMessage: '' },
        facebook: { username: '', customMessage: '' },
        email: { email: '', subject: '', body: '', customMessage: '' },
    });

    // Generated QR values per tab
    const [qrValues, setQrValues] = useState<Partial<Record<SocialMode, string>>>({});

    // Ref Maps for unique capturing
    const captureRefs = useRef<Partial<Record<SocialMode, React.RefObject<any>>>>({
        whatsapp: useRef(null),
        instagram: useRef(null),
        twitter: useRef(null),
        linkedin: useRef(null),
        github: useRef(null),
        facebook: useRef(null),
        email: useRef(null),
    });

    const qrRefs = useRef<Partial<Record<SocialMode, React.RefObject<any>>>>({
        whatsapp: useRef(null),
        instagram: useRef(null),
        twitter: useRef(null),
        linkedin: useRef(null),
        github: useRef(null),
        facebook: useRef(null),
        email: useRef(null),
    });

    const updateField = useCallback((mode: SocialMode, key: string, value: string) => {
        setFields(prev => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [key]: value
            }
        }));
    }, []);

    const generateQR = useCallback((mode: SocialMode) => {
        const platformFields = fields[mode];
        if (!platformFields) return;

        let value = '';
        const customMsg = platformFields.customMessage || '';

        switch (mode) {
            case 'whatsapp':
                if (!platformFields.phoneNumber) {
                    Alert.alert('Error', 'Please enter a phone number');
                    return;
                }
                const cleanPhone = platformFields.phoneNumber.replace(/\D/g, '');
                value = `https://wa.me/${platformFields.countryCode}${cleanPhone}${customMsg ? `?text=${encodeURIComponent(customMsg)}` : ''}`;
                break;
            case 'instagram':
                if (!platformFields.username) {
                    Alert.alert('Error', 'Please enter a username');
                    return;
                }
                const igUser = platformFields.username.replace('@', '');
                value = `https://instagram.com/${igUser}`;
                break;
            case 'twitter':
                if (!platformFields.username) {
                    Alert.alert('Error', 'Please enter a handle');
                    return;
                }
                const twUser = platformFields.username.replace('@', '');
                value = `https://twitter.com/${twUser}`;
                break;
            case 'linkedin':
                if (!platformFields.username) {
                    Alert.alert('Error', 'Please enter a profile ID');
                    return;
                }
                value = `https://linkedin.com/in/${platformFields.username}`;
                break;
            case 'github':
                if (!platformFields.username) {
                    Alert.alert('Error', 'Please enter a username');
                    return;
                }
                value = `https://github.com/${platformFields.username}`;
                break;
            case 'facebook':
                if (!platformFields.username) {
                    Alert.alert('Error', 'Please enter a profile name/ID');
                    return;
                }
                value = `https://facebook.com/${platformFields.username}`;
                break;
            case 'email':
                if (!platformFields.email) {
                    Alert.alert('Error', 'Please enter an email address');
                    return;
                }
                const mailto = `mailto:${platformFields.email}?subject=${encodeURIComponent(platformFields.subject || '')}&body=${encodeURIComponent(platformFields.body || '')}`;
                value = mailto;
                break;
        }

        if (value) {
            setQrValues(prev => ({ ...prev, [mode]: value }));
        }
    }, [fields]);

    const saveToGallery = useCallback(async (mode: SocialMode) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow gallery access to save QR codes');
                return;
            }

            const ref = captureRefs.current[mode];
            if (!ref?.current) return;

            const uri = await captureRef(ref, {
                format: 'png',
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Success', 'QR Code saved to gallery!');
        } catch (error) {
            console.error('Error saving QR code:', error);
            Alert.alert('Error', 'Failed to save QR code');
        }
    }, []);

    const downloadQRCode = useCallback(async (mode: SocialMode) => {
        try {
            const ref = captureRefs.current[mode];
            if (!ref?.current) return;

            const uri = await captureRef(ref, {
                format: 'png',
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Error sharing QR code:', error);
            Alert.alert('Error', 'Failed to share QR code');
        }
    }, []);

    return {
        fields,
        qrValues,
        captureRefs,
        qrRefs,
        updateField,
        generateQR,
        saveToGallery,
        downloadQRCode
    };
}
