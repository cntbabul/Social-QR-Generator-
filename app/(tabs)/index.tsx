import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState, useCallback } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Modular Imports
import { TABS } from '@/components/social/social-config';
import { useSocialQR } from '@/components/social/useSocialQR';
import { PlatformPage } from '@/components/social/PlatformPage';
import { SocialMode } from '@/components/social/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SocialScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeTab = TABS[activeIndex] || TABS[0];

    // Shared Tab Navigation Refs
    const pagerRef = useRef<ScrollView>(null);
    const tabScrollRef = useRef<ScrollView>(null);

    // Business Logic Hook
    const { 
        fields, 
        qrValues, 
        captureRefs, 
        qrRefs, 
        updateField, 
        generateQR, 
        saveToGallery, 
        downloadQRCode 
    } = useSocialQR();

    const handleTabPress = useCallback((index: number) => {
        setActiveIndex(index);
        
        // Scroll the horizontal paging ScrollView to the selected page
        pagerRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
        
        // Scroll the tab bar to keep the selected tab visible
        tabScrollRef.current?.scrollTo({
            x: Math.max(0, index * 100 - SCREEN_WIDTH / 2 + 60),
            animated: true,
        });
    }, []);

    const handleScrollEnd = useCallback((e: any) => {
        const offset = e.nativeEvent.contentOffset.x;
        const index = Math.round(offset / SCREEN_WIDTH);
        if (index !== activeIndex && index >= 0 && index < TABS.length) {
            setActiveIndex(index);
            tabScrollRef.current?.scrollTo({
                x: Math.max(0, index * 100 - SCREEN_WIDTH / 2 + 60),
                animated: true,
            });
        }
    }, [activeIndex]);

    return (
        <View style={[styles.container, { backgroundColor: activeTab.color + '15' }]}>
            <LinearGradient
                colors={[activeTab.color + '30', 'transparent']}
                style={StyleSheet.absoluteFill}
            />
            <StatusBar barStyle="light-content" />
            
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Social QR</Text>
                    <Text style={styles.headerSubtitle}>Instant QR codes for your profiles</Text>
                </View>

                {/* Top Tab Bar Wrapper */}
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
                    {TABS.map((tab) => (
                        <PlatformPage 
                            key={tab.id}
                            config={tab}
                            fields={(fields as any)[tab.id] || {}}
                            qrValue={(qrValues as any)[tab.id] || ''}
                            onUpdateField={(key, val) => updateField(tab.id, key, val)}
                            onGenerate={() => generateQR(tab.id)}
                            onShare={() => downloadQRCode(tab.id)}
                            onSave={() => saveToGallery(tab.id)}
                            captureRef={(captureRefs.current as any)[tab.id]!}
                            qrRef={(qrRefs.current as any)[tab.id]!}
                        />
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header Styles
    headerContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#333',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        fontWeight: '500',
    },

    // Tab Bar Styles
    tabBarWrapper: {
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    tabBarContent: {
        paddingHorizontal: 15,
        paddingBottom: 12,
        paddingTop: 8,
    },
    tabItem: {
        marginRight: 10,
    },
    tabActive: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        gap: 6,
    },
    tabInactive: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        gap: 6,
    },
    tabLabelActive: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabLabelInactive: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    tabIndicatorBar: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    tabIndicatorFill: {
        height: '100%',
        width: 100, // Approximate width of active tab
    },
});
