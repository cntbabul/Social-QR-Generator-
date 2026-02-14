import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';


import React, { useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Common country codes
const COUNTRY_CODES = [
    { label: "India (+91)", value: "91" },
    { label: "USA/Canada (+1)", value: "1" },
    { label: "UK (+44)", value: "44" },
    { label: "Australia (+61)", value: "61" },
    { label: "UAE (+971)", value: "971" },
    { label: "Germany (+49)", value: "49" },
    { label: "France (+33)", value: "33" },
    { label: "Japan (+81)", value: "81" },
    { label: "China (+86)", value: "86" },
];



export default function SocialScreen() {
    const [socialMode, setSocialMode] = useState<'whatsapp' | 'email' | 'instagram' | 'twitter' | 'linkedin' | 'github' | 'facebook' | 'business'>('whatsapp');

    // Standard Modes State
    const [countryCode, setCountryCode] = useState("91");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [instagramUsername, setInstagramUsername] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");
    const [linkedinProfile, setLinkedinProfile] = useState("");
    const [githubUsername, setGithubUsername] = useState("");
    const [facebookProfile, setFacebookProfile] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    // ...



    const [qrValue, setQrValue] = useState("");
    const qrRef = useRef<any>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions(); // Removed hook to avoid init errors

    const handleGenerate = () => {
        if (socialMode === 'whatsapp') {
            if (!phoneNumber.trim()) {
                Alert.alert("Phone Number Required", "Please enter a valid phone number.");
                return;
            }
            const cleanPhone = phoneNumber.replace(/^0+|^\+|[^0-9]/g, '');
            const link = `https://wa.me/${countryCode}${cleanPhone}`;
            setQrValue(link);


        } else if (socialMode === 'instagram') {
            if (!instagramUsername.trim()) {
                Alert.alert("Username Required", "Please enter a valid Instagram username.");
                return;
            }
            const cleanUsername = instagramUsername.trim().replace('@', '');
            const link = `https://instagram.com/${cleanUsername}`;
            setQrValue(link);
        } else if (socialMode === 'twitter') {
            if (!twitterHandle.trim()) {
                Alert.alert("Handle Required", "Please enter a valid Twitter/X handle.");
                return;
            }
            const cleanHandle = twitterHandle.trim().replace('@', '');
            const link = `https://twitter.com/${cleanHandle}`;
            setQrValue(link);
        } else if (socialMode === 'linkedin') {
            if (!linkedinProfile.trim()) {
                Alert.alert("Profile Required", "Please enter a valid LinkedIn profile ID.");
                return;
            }
            // Assume user enters just the ID part or full URL, basic cleanup
            const cleanProfile = linkedinProfile.trim().replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
            const link = `https://linkedin.com/in/${cleanProfile}`;
            setQrValue(link);
        } else if (socialMode === 'github') {
            if (!githubUsername.trim()) {
                Alert.alert("Username Required", "Please enter a valid GitHub username.");
                return;
            }
            const cleanUsername = githubUsername.trim();
            const link = `https://github.com/${cleanUsername}`;
            setQrValue(link);
        } else if (socialMode === 'facebook') {
            if (!facebookProfile.trim()) {
                Alert.alert("Profile Required", "Please enter a valid Facebook page/profile ID.");
                return;
            }
            const cleanProfile = facebookProfile.trim().replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '');
            const link = `https://facebook.com/${cleanProfile}`;
            setQrValue(link);
        } else {
            if (!emailAddress.trim()) {
                Alert.alert("Email Required", "Please enter a valid email address.");
                return;
            }

            let link = `mailto:${emailAddress}`;
            const params = [];
            if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
            if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);

            if (params.length > 0) {
                link += `?${params.join('&')}`;
            }

            setQrValue(link);
        }
        Keyboard.dismiss();

        // Auto-scroll to the bottom where QR code appears
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const captureViewRef = useRef<View>(null);

    const downloadQRCode = async () => {
        try {
            const uri = await captureRef(captureViewRef, {
                format: "png",
                quality: 1,
            });

            const directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;
            const filename = directory + "social_qrcode_with_number.png";

            await FileSystem.copyAsync({
                from: uri,
                to: filename
            });

            Sharing.shareAsync(filename).catch(err => {
                Alert.alert("Error", "Sharing failed: " + err.message);
            });
        } catch (error: any) {
            Alert.alert("Error", "Failed to share image: " + error.message);
        }
    };

    const saveToGallery = async () => {
        try {
            // Request write-only permission to avoid unnecessary read permissions (like AUDIO on some devices)
            const permission = await MediaLibrary.requestPermissionsAsync(true);

            if (!permission.granted) {
                Alert.alert("Permission Required", "Please grant permission to save images to your gallery in settings.");
                return;
            }

            const uri = await captureRef(captureViewRef, {
                format: "png",
                quality: 1,
            });

            // Ensure file has valid extension for Android MediaScanner
            const fileUri = FileSystem.cacheDirectory + "social_qr_code.png";
            await FileSystem.copyAsync({
                from: uri,
                to: fileUri
            });

            const asset = await MediaLibrary.createAssetAsync(fileUri);

            // Explicitly creating an album is optional but good for organization.
            try {
                await MediaLibrary.createAlbumAsync("SocialQR", asset, false);
            } catch (e) {
                console.log("Album creation error", e);
            }

            Alert.alert("Success", "QR Code saved to Gallery!");
        } catch (error: any) {
            // Specific error handling for the "AUDIO permission" issue which means native build is stale
            if (error.message && error.message.includes("AUDIO")) {
                Alert.alert(
                    "Configuration Error",
                    "Your app needs to be rebuilt to support saving. Please run your build command again.",
                    [
                        { text: "OK" },
                        { text: "Share Instead", onPress: () => downloadQRCode() }
                    ]
                );
            } else {
                Alert.alert("Save Error", error.message || "Unknown error occurred");
            }
        }
    };

    const getSubtitle = () => {
        switch (socialMode) {
            case 'whatsapp': return "Direct Message via WhatsApp";
            case 'instagram': return "Link to Instagram Profile";
            case 'twitter': return "Link to X (Twitter) Profile";
            case 'linkedin': return "Link to LinkedIn Profile";
            case 'github': return "Link to GitHub Profile";
            case 'facebook': return "Link to Facebook Profile";
            case 'email': return "Compose Email via QR";

            default: return "Social QR";
        }
    };

    const getButtonColor = () => {
        switch (socialMode) {
            case 'whatsapp': return '#25D366';
            case 'instagram': return '#C13584';
            case 'twitter': return '#1DA1F2';
            case 'linkedin': return '#0077B5';
            case 'github': return '#333';
            case 'facebook': return '#1877F2';
            case 'email': return '#EA4335';

            default: return '#4A90E2';
        }
    };

    const getButtonIcon = () => {
        switch (socialMode) {
            case 'whatsapp': return 'whatsapp';
            case 'instagram': return 'instagram';
            case 'twitter': return 'twitter';
            case 'linkedin': return 'linkedin';
            case 'github': return 'github';
            case 'facebook': return 'facebook';
            case 'email': return 'email-plus';

            default: return 'qrcode';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <Text style={styles.title}>Social QR</Text>
                <Text style={styles.subtitle}>{getSubtitle()}</Text>

                <View style={styles.modeSelectorContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeSelectorScroll}>
                        {[
                            { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' },
                            { id: 'instagram', icon: 'instagram', label: 'Instagram' },

                            { id: 'twitter', icon: 'twitter', label: 'Twitter/X' },
                            { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn' },
                            { id: 'github', icon: 'github', label: 'GitHub' },
                            { id: 'facebook', icon: 'facebook', label: 'Facebook' },
                            { id: 'email', icon: 'email', label: 'Email' },
                        ].map((mode) => (
                            <TouchableOpacity
                                key={mode.id}
                                style={[styles.modeButton, socialMode === mode.id && styles.modeButtonActive]}
                                onPress={() => { setSocialMode(mode.id as any); setQrValue(""); }}
                            >
                                <MaterialCommunityIcons
                                    name={mode.icon as any}
                                    size={20}
                                    color={socialMode === mode.id ? "#FFF" : "#8E8E93"}
                                />
                                <Text style={[styles.modeText, socialMode === mode.id && styles.modeTextActive]}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.card}>
                    {socialMode === 'whatsapp' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>COUNTRY CODE</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={countryCode}
                                        onValueChange={(itemValue) => setCountryCode(itemValue)}
                                        style={styles.picker}
                                        dropdownIconColor="#FFF"
                                        itemStyle={{ color: '#FFF' }}
                                        mode="dropdown"
                                    >
                                        {COUNTRY_CODES.map((code) => (
                                            <Picker.Item key={code.value} label={code.label} value={code.value} color="#000" />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>PHONE NUMBER</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#666"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                    />
                                    {phoneNumber.length > 0 && (
                                        <TouchableOpacity onPress={() => setPhoneNumber('')} style={styles.clearButton}>
                                            <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </>

                    ) : socialMode === 'instagram' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>INSTAGRAM USERNAME</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="@username"
                                        placeholderTextColor="#666"
                                        value={instagramUsername}
                                        onChangeText={setInstagramUsername}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        </>
                    ) : socialMode === 'twitter' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>TWITTER/X HANDLE</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="@handle"
                                        placeholderTextColor="#666"
                                        value={twitterHandle}
                                        onChangeText={setTwitterHandle}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        </>
                    ) : socialMode === 'linkedin' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>LINKEDIN PROFILE ID</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. john-doe-123"
                                        placeholderTextColor="#666"
                                        value={linkedinProfile}
                                        onChangeText={setLinkedinProfile}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        </>
                    ) : socialMode === 'github' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>GITHUB USERNAME</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="username"
                                        placeholderTextColor="#666"
                                        value={githubUsername}
                                        onChangeText={setGithubUsername}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        </>
                    ) : socialMode === 'facebook' ? (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>FACEBOOK PROFILE ID/NAME</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="username or id"
                                        placeholderTextColor="#666"
                                        value={facebookProfile}
                                        onChangeText={setFacebookProfile}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>EMAIL ADDRESS</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="name@example.com"
                                        placeholderTextColor="#666"
                                        value={emailAddress}
                                        onChangeText={setEmailAddress}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {emailAddress.length > 0 && (
                                        <TouchableOpacity onPress={() => setEmailAddress('')} style={styles.clearButton}>
                                            <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>SUBJECT (OPTIONAL)</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter subject"
                                        placeholderTextColor="#666"
                                        value={emailSubject}
                                        onChangeText={setEmailSubject}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>BODY (OPTIONAL)</Text>
                                <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start' }]}>
                                    <TextInput
                                        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                        placeholder="Enter email content..."
                                        placeholderTextColor="#666"
                                        value={emailBody}
                                        onChangeText={setEmailBody}
                                        multiline
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CUSTOM MESSAGE (OPTIONAL)</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter custom message..."
                                placeholderTextColor="#666"
                                value={customMessage}
                                onChangeText={setCustomMessage}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleGenerate}
                        style={[
                            styles.generateButton,
                            { backgroundColor: getButtonColor() }
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={getButtonIcon() as any}
                            size={24} color="#FFF"
                        />
                        <Text style={styles.buttonText}>Generate {socialMode.charAt(0).toUpperCase() + socialMode.slice(1)} QR</Text>
                    </TouchableOpacity>
                </View>

                {qrValue ? (
                    <View style={styles.resultCard}>
                        <View
                            ref={captureViewRef}
                            style={styles.qrCaptureContainer}
                            collapsable={false}
                        >
                            {customMessage ? (
                                <Text style={styles.customMessageText}>{customMessage}</Text>
                            ) : null}
                            <QRCode
                                value={qrValue}
                                size={200}
                                backgroundColor="white"
                                color="black"
                                getRef={(ref) => (qrRef.current = ref)}
                            />
                            <Text style={styles.captureText}>
                                {socialMode === 'whatsapp' ? `WhatsApp: +${countryCode} ${phoneNumber}` :
                                    socialMode === 'instagram' ? `IG: @${instagramUsername.replace('@', '')}` :
                                        socialMode === 'twitter' ? `X: @${twitterHandle.replace('@', '')}` :
                                            socialMode === 'linkedin' ? `LinkedIn: ${linkedinProfile}` :
                                                socialMode === 'github' ? `GitHub: ${githubUsername}` :
                                                    socialMode === 'facebook' ? `FB: ${facebookProfile}` :

                                                        `Email: ${emailAddress}`}
                            </Text>
                        </View>
                        <Text style={styles.qrLabel}>Ready to Share</Text>

                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity onPress={downloadQRCode} style={styles.actionButton}>
                                <MaterialCommunityIcons name="share-variant" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveToGallery} style={[styles.actionButton, styles.saveButton]}>
                                <MaterialCommunityIcons name="download" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.placeholderContainer}>
                        <MaterialCommunityIcons name="message-text-outline" size={80} color="#333" />
                        <Text style={styles.placeholderText}>Enter details to create QR</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    modeSelectorContainer: {
        height: 60,
        marginBottom: 20,
        width: '100%',
    },
    modeSelectorScroll: {
        paddingHorizontal: 4,
        alignItems: 'center',
        gap: 10,
    },
    card: {
        width: '100%',
        backgroundColor: '#1E1E1E', // Card background
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8E8E93',
        marginBottom: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 12,
        backgroundColor: '#2C2C2E',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#FFFFFF', // For Android text color
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 12,
        backgroundColor: '#2C2C2E',
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#FFFFFF',
    },
    clearButton: {
        padding: 8,
    },
    generateButton: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#25D366', // WhatsApp Green
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: "#25D366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    resultCard: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    modeSelector: { // Kept for backward compatibility if needed, but overridden by container
        flexDirection: 'row',
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
        backgroundColor: '#1E1E1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    modeButtonActive: {
        backgroundColor: '#323232',
        borderColor: '#4A90E2',
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
    },
    modeTextActive: {
        color: '#FFFFFF',
    },
    qrCaptureContainer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    captureText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    qrLabel: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        marginBottom: 20,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
        marginTop: 20,
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#323232',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    saveButton: {
        backgroundColor: '#4A90E2', // Blue for Save
        borderColor: '#4A90E2',
    },
    customMessageText: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
});
