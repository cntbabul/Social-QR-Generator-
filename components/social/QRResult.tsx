import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

interface QRResultProps {
    qrValue: string;
    captureViewRef: React.RefObject<any>;
    qrRef: React.RefObject<any>;
    label: string;
    customMessage: string;
    onShare: () => void;
    onSave: () => void;
}

export const QRResult: React.FC<QRResultProps> = ({
    qrValue,
    captureViewRef,
    qrRef,
    label,
    customMessage,
    onShare,
    onSave,
}) => {
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
};

const styles = StyleSheet.create({
    resultCard: {
        marginTop: 24,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    cardGlass: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    cardContent: {
        padding: 20,
    },
    qrCaptureContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    qrWrapper: {
        padding: 10,
        backgroundColor: 'white',
    },
    customMessageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 15,
        textAlign: 'center',
    },
    captureLabel: {
        marginTop: 15,
        fontSize: 12,
        color: '#888',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    readyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 12,
        marginTop: 20,
        gap: 8,
    },
    readyText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 15,
        gap: 8,
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
