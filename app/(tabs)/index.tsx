import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Common country codes
const COUNTRY_CODES = [
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

type SocialMode = 'whatsapp' | 'instagram' | 'twitter' | 'linkedin' | 'github' | 'facebook' | 'email';

const TABS: {
    id: SocialMode;
    label: string;
    icon: string;
    gradient: readonly [string, ...string[]];
    color: string;
}[] = [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', gradient: ['#25D366', '#128C7E'] as const, color: '#25D366' },
    { id: 'instagram', label: 'Instagram', icon: 'instagram', gradient: ['#F58529', '#DD2A7B', '#8134AF'] as const, color: '#DD2A7B' },
    { id: 'twitter', label: 'Twitter/X', icon: 'twitter', gradient: ['#1DA1F2', '#0E71C8'] as const, color: '#1DA1F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', gradient: ['#0077B5', '#005885'] as const, color: '#0077B5' },
    { id: 'github', label: 'GitHub', icon: 'github', gradient: ['#555', '#24292E'] as const, color: '#ccc' },
    { id: 'facebook', label: 'Facebook', icon: 'facebook', gradient: ['#1877F2', '#0C63D4'] as const, color: '#1877F2' },
    { id: 'email', label: 'Email', icon: 'email', gradient: ['#EA4335', '#C5221F'] as const, color: '#EA4335' },
];

export default function SocialScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeTab = TABS[activeIndex] || TABS[0]; // Safety fallback

    // Fields state
    const [countryCode, setCountryCode] = useState('91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [instagramUsername, setInstagramUsername] = useState('');
    const [twitterHandle, setTwitterHandle] = useState('');
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [facebookProfile, setFacebookProfile] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [qrValue, setQrValue] = useState('');

    const pagerRef = useRef<any>(null); // Kept as any to avoid breaking other logic for now
    const tabScrollRef = useRef<ScrollView>(null);
    const qrRef = useRef<any>(null);
    const captureViewRef = useRef<View>(null);
    const mainScrollRef = useRef<ScrollView>(null);

    // Added to check for early boot issues
    React.useEffect(() => {
        console.log("Social screen mounted");
    }, []);

    const handleTabPress = (index: number) => {
        setActiveIndex(index);
        setQrValue('');
        // Scroll the horizontal paging ScrollView to the selected page
        pagerRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
        
        // Scroll the tab bar to keep the selected tab visible
        tabScrollRef.current?.scrollTo({
            x: Math.max(0, index * 100 - SCREEN_WIDTH / 2 + 60),
            animated: true,
        });
    };

    const handleScrollEnd = (e: any) => {
        const offset = e.nativeEvent.contentOffset.x;
        const index = Math.round(offset / SCREEN_WIDTH);
        if (index !== activeIndex && index >= 0 && index < TABS.length) {
            setActiveIndex(index);
            setQrValue('');
            tabScrollRef.current?.scrollTo({
                x: Math.max(0, index * 100 - SCREEN_WIDTH / 2 + 60),
                animated: true,
            });
        }
    };

    const handleGenerate = (mode: SocialMode) => {
        switch (mode) {
            case 'whatsapp':
                if (!phoneNumber.trim()) {
                    Alert.alert('Phone Number Required', 'Please enter a valid phone number.');
                    return;
                }
                setQrValue(`https://wa.me/${countryCode}${phoneNumber.replace(/^0+|^\+|[^0-9]/g, '')}`);
                break;
            case 'instagram':
                if (!instagramUsername.trim()) {
                    Alert.alert('Username Required', 'Please enter a valid Instagram username.');
                    return;
                }
                setQrValue(`https://instagram.com/${instagramUsername.trim().replace('@', '')}`);
                break;
            case 'twitter':
                if (!twitterHandle.trim()) {
                    Alert.alert('Handle Required', 'Please enter a valid Twitter/X handle.');
                    return;
                }
                setQrValue(`https://twitter.com/${twitterHandle.trim().replace('@', '')}`);
                break;
            case 'linkedin':
                if (!linkedinProfile.trim()) {
                    Alert.alert('Profile Required', 'Please enter a valid LinkedIn profile ID.');
                    return;
                }
                setQrValue(`https://linkedin.com/in/${linkedinProfile.trim().replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}`);
                break;
            case 'github':
                if (!githubUsername.trim()) {
                    Alert.alert('Username Required', 'Please enter a valid GitHub username.');
                    return;
                }
                setQrValue(`https://github.com/${githubUsername.trim()}`);
                break;
            case 'facebook':
                if (!facebookProfile.trim()) {
                    Alert.alert('Profile Required', 'Please enter a valid Facebook profile ID.');
                    return;
                }
                setQrValue(`https://facebook.com/${facebookProfile.trim().replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/\/$/, '')}`);
                break;
            case 'email':
                if (!emailAddress.trim()) {
                    Alert.alert('Email Required', 'Please enter a valid email address.');
                    return;
                }
                const params: string[] = [];
                if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
                if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
                setQrValue(`mailto:${emailAddress}${params.length > 0 ? `?${params.join('&')}` : ''}`);
                break;
        }
        Keyboard.dismiss();
        setTimeout(() => {
            mainScrollRef.current?.scrollToEnd({ animated: true });
        }, 150);
    };

    const downloadQRCode = async () => {
        try {
            const uri = await captureRef(captureViewRef, { format: 'png', quality: 1 });
            const filename = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + 'social_qr.png';
            await FileSystem.copyAsync({ from: uri, to: filename });
            Sharing.shareAsync(filename).catch((err) => Alert.alert('Error', 'Sharing failed: ' + err.message));
        } catch (error: any) {
            Alert.alert('Error', 'Failed to share: ' + error.message);
        }
    };

    const saveToGallery = async () => {
        try {
            const permission = await MediaLibrary.requestPermissionsAsync(true);
            if (!permission.granted) {
                Alert.alert('Permission Required', 'Please grant permission to save images.');
                return;
            }
            const uri = await captureRef(captureViewRef, { format: 'png', quality: 1 });
            const fileUri = FileSystem.cacheDirectory + 'social_qr.png';
            await FileSystem.copyAsync({ from: uri, to: fileUri });
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            try { await MediaLibrary.createAlbumAsync('SocialQR', asset, false); } catch (e) { }
            Alert.alert('Success', 'QR Code saved to Gallery!');
        } catch (error: any) {
            Alert.alert('Save Error', error.message || 'Unknown error');
        }
    };

    const getCaptureLabel = (mode: SocialMode) => {
        switch (mode) {
            case 'whatsapp': return `WhatsApp: +${countryCode} ${phoneNumber}`;
            case 'instagram': return `IG: @${instagramUsername.replace('@', '')}`;
            case 'twitter': return `X: @${twitterHandle.replace('@', '')}`;
            case 'linkedin': return `LinkedIn: ${linkedinProfile}`;
            case 'github': return `GitHub: ${githubUsername}`;
            case 'facebook': return `FB: ${facebookProfile}`;
            case 'email': return `Email: ${emailAddress}`;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F0C29', '#302B63', '#24243E']}
                style={StyleSheet.absoluteFillObject}
            />
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>

                {/* ── HEADER ── */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Social QR</Text>
                    <Text style={styles.headerSubtitle}>Generate QR for any platform</Text>
                </View>

                {/* ── TAB BAR ── */}
                <View style={styles.tabBarWrapper}>
                    <ScrollView
                        ref={tabScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabBarContent}
                    >
                        {TABS.map((tab, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={() => handleTabPress(index)}
                                    activeOpacity={0.8}
                                    style={styles.tabItem}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={tab.gradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.tabActive}
                                        >
                                            <MaterialCommunityIcons name={tab.icon as any} size={18} color="#FFF" />
                                            <Text style={styles.tabLabelActive}>{tab.label}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View style={styles.tabInactive}>
                                            <MaterialCommunityIcons name={tab.icon as any} size={17} color="#A0A0A0" />
                                            <Text style={styles.tabLabelInactive}>{tab.label}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Active indicator line */}
                    <View style={styles.tabIndicatorBar}>
                        <View style={[styles.tabIndicatorFill, { backgroundColor: activeTab.color }]} />
                    </View>
                </View>

                {/* ── PAGED CONTENT (Pure JS Alternative to PagerView) ── */}
                <ScrollView
                    ref={pagerRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScrollEnd}
                    style={{ flex: 1 }}
                    scrollEventThrottle={16}
                >
                    <View key="whatsapp" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="earth" size={14} color="#A0A0FF" /> COUNTRY CODE
                                        </Text>
                                        <View style={styles.pickerWrapper}>
                                            <Picker
                                                selectedValue={countryCode}
                                                onValueChange={setCountryCode}
                                                style={styles.picker}
                                                dropdownIconColor="#FFF"
                                                mode="dropdown"
                                            >
                                                {COUNTRY_CODES.map((c) => (
                                                    <Picker.Item key={c.value} label={c.label} value={c.value} color="#000" />
                                                ))}
                                            </Picker>
                                        </View>

                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="phone" size={14} color="#A0A0FF" /> PHONE NUMBER
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter phone number"
                                                placeholderTextColor="#888"
                                                value={phoneNumber}
                                                onChangeText={setPhoneNumber}
                                                keyboardType="phone-pad"
                                            />
                                            {phoneNumber.length > 0 && (
                                                <TouchableOpacity onPress={() => setPhoneNumber('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        </View>
                                    </View>
                                    {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('whatsapp')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                                </ScrollView>
                            </View>

                    <View key="instagram" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="instagram" size={14} color="#F093FB" /> INSTAGRAM USERNAME
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="@username"
                                                placeholderTextColor="#888"
                                                value={instagramUsername}
                                                onChangeText={setInstagramUsername}
                                                autoCapitalize="none"
                                            />
                                            {instagramUsername.length > 0 && (
                                                <TouchableOpacity onPress={() => setInstagramUsername('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('instagram')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#F58529', '#DD2A7B', '#8134AF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="instagram" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate Instagram QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('instagram')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                            </ScrollView>
                        </View>

                    <View key="twitter" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="twitter" size={14} color="#1DA1F2" /> TWITTER/X HANDLE
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="@handle"
                                                placeholderTextColor="#888"
                                                value={twitterHandle}
                                                onChangeText={setTwitterHandle}
                                                autoCapitalize="none"
                                            />
                                            {twitterHandle.length > 0 && (
                                                <TouchableOpacity onPress={() => setTwitterHandle('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('twitter')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#1DA1F2', '#0E71C8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="twitter" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate Twitter/X QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                    {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('twitter')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                                </ScrollView>
                            </View>

                    <View key="linkedin" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="linkedin" size={14} color="#0077B5" /> LINKEDIN PROFILE ID
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g. john-doe-123"
                                                placeholderTextColor="#888"
                                                value={linkedinProfile}
                                                onChangeText={setLinkedinProfile}
                                                autoCapitalize="none"
                                            />
                                            {linkedinProfile.length > 0 && (
                                                <TouchableOpacity onPress={() => setLinkedinProfile('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('linkedin')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#0077B5', '#005885']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="linkedin" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate LinkedIn QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                    {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('linkedin')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                                </ScrollView>
                            </View>

                    <View key="github" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="github" size={14} color="#FFF" /> GITHUB USERNAME
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="username"
                                                placeholderTextColor="#888"
                                                value={githubUsername}
                                                onChangeText={setGithubUsername}
                                                autoCapitalize="none"
                                            />
                                            {githubUsername.length > 0 && (
                                                <TouchableOpacity onPress={() => setGithubUsername('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('github')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#555', '#24292E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="github" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate GitHub QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('github')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                            </ScrollView>
                        </View>

                    <View key="facebook" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="facebook" size={14} color="#1877F2" /> FACEBOOK PROFILE ID/NAME
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="username or id"
                                                placeholderTextColor="#888"
                                                value={facebookProfile}
                                                onChangeText={setFacebookProfile}
                                                autoCapitalize="none"
                                            />
                                            {facebookProfile.length > 0 && (
                                                <TouchableOpacity onPress={() => setFacebookProfile('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('facebook')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#1877F2', '#0C63D4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="facebook" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate Facebook QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('facebook')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                            </ScrollView>
                        </View>

                    <View key="email" style={{ width: SCREEN_WIDTH, flex: 1 }}>
                            <ScrollView
                                ref={mainScrollRef}
                                contentContainerStyle={styles.pageContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.card}>
                                    <View style={styles.cardGlass} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.sectionTitle}>
                                            <MaterialCommunityIcons name="email" size={14} color="#EA4335" /> EMAIL ADDRESS
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="name@example.com"
                                                placeholderTextColor="#888"
                                                value={emailAddress}
                                                onChangeText={setEmailAddress}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                            {emailAddress.length > 0 && (
                                                <TouchableOpacity onPress={() => setEmailAddress('')} style={styles.clearBtn}>
                                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="format-title" size={14} color="#A0A0FF" /> SUBJECT (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter subject"
                                                placeholderTextColor="#888"
                                                value={emailSubject}
                                                onChangeText={setEmailSubject}
                                            />
                                        </View>

                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="text" size={14} color="#A0A0FF" /> BODY (OPTIONAL)
                                        </Text>
                                        <View style={[styles.inputRow, { height: 100, alignItems: 'flex-start' }]}>
                                            <TextInput
                                                style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                                                placeholder="Enter email content..."
                                                placeholderTextColor="#888"
                                                value={emailBody}
                                                onChangeText={setEmailBody}
                                                multiline
                                            />
                                        </View>

                                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                                        </Text>
                                        <View style={styles.inputRow}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Add a label..."
                                                placeholderTextColor="#888"
                                                value={customMessage}
                                                onChangeText={setCustomMessage}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => handleGenerate('email')} activeOpacity={0.9}>
                                            <LinearGradient colors={['#EA4335', '#C5221F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.generateBtn}>
                                                <MaterialCommunityIcons name="email-plus" size={22} color="#FFF" />
                                                <Text style={styles.generateBtnText}>Generate Email QR</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {qrValue && <QRResult qrValue={qrValue} captureViewRef={captureViewRef} qrRef={qrRef} label={getCaptureLabel('email')} customMessage={customMessage} onShare={downloadQRCode} onSave={saveToGallery} />}
                            </ScrollView>
                        </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// ─── QR Result Component ──────────────────────────────────────────────────────
function QRResult({
    qrValue,
    captureViewRef,
    qrRef,
    label,
    customMessage,
    onShare,
    onSave,
}: {
    qrValue: string;
    captureViewRef: React.RefObject<any>;
    qrRef: React.RefObject<any>;
    label: string;
    customMessage: string;
    onShare: () => void;
    onSave: () => void;
}) {
    return (
        <View style={styles.resultCard}>
            <View style={styles.cardGlass} />
            <View style={styles.cardContent}>
                <View ref={captureViewRef} style={styles.qrCaptureContainer} collapsable={false}>
                    {customMessage ? (
                        <Text style={styles.customMessageText}>{customMessage}</Text>
                    ) : null}
                    <View style={styles.qrWrapper}>
                        <QRCode
                            value={qrValue}
                            size={200}
                            backgroundColor="white"
                            color="black"
                            getRef={(ref) => (qrRef.current = ref)}
                        />
                    </View>
                    <Text style={styles.captureLabel}>{label}</Text>
                </View>

                <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.readyBadge}
                >
                    <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.readyText}>Ready to Share</Text>
                </LinearGradient>

                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={onShare} activeOpacity={0.9} style={{ flex: 1 }}>
                        <LinearGradient colors={['#667EEA', '#764BA2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionBtn}>
                            <MaterialCommunityIcons name="share-variant" size={20} color="#FFF" />
                            <Text style={styles.actionBtnText}>Share</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSave} activeOpacity={0.9} style={{ flex: 1 }}>
                        <LinearGradient colors={['#F093FB', '#F5576C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionBtn}>
                            <MaterialCommunityIcons name="download" size={20} color="#FFF" />
                            <Text style={styles.actionBtnText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    headerContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#B8B8D1',
        fontWeight: '500',
        marginTop: 2,
    },

    // Tab Bar
    tabBarWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(15,12,41,0.6)',
    },
    tabBarContent: {
        paddingHorizontal: 8,
        gap: 6,
        paddingVertical: 8,
    },
    tabItem: {},
    tabActive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        elevation: 4,
    },
    tabInactive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    tabLabelActive: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFF',
    },
    tabLabelInactive: {
        fontSize: 13,
        fontWeight: '600',
        color: '#A0A0A0',
    },
    tabIndicatorBar: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    tabIndicatorFill: {
        height: 3,
        width: '100%',
        borderRadius: 2,
    },

    // Pages
    pageContent: {
        padding: 16,
        paddingBottom: 100,
    },

    // Cards
    card: {
        width: '100%',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
    },
    cardGlass: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
    },
    cardContent: { padding: 20 },

    // Inputs
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#B8B8D1',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 14,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    clearBtn: { padding: 8 },
    pickerWrapper: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    picker: { height: 52, width: '100%', color: '#FFF' },

    // Generate button
    generateBtn: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
        elevation: 8,
    },
    generateBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.4,
    },

    // QR Result
    resultCard: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
    },
    qrCaptureContainer: {
        padding: 24,
        backgroundColor: '#FFF',
        borderRadius: 20,
        alignItems: 'center',
        elevation: 4,
    },
    qrWrapper: {
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 14,
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    captureLabel: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
        letterSpacing: 0.2,
    },
    customMessageText: {
        marginBottom: 12,
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A2E',
        textAlign: 'center',
    },
    readyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginVertical: 16,
    },
    readyText: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '700',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    actionBtn: {
        flexDirection: 'row',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 6,
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
