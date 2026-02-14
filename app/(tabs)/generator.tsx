import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

const Generator = () => {
    const [text, setText] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [qrValue, setQrValue] = useState('');
    const qrRef = useRef<any>(null);
    const captureViewRef = useRef<View>(null);

    const pasteFromClipboard = async () => {
        const content = await Clipboard.getStringAsync();
        if (content) {
            setText(content);
        }
    };

    const handleGenerate = () => {
        if (!text.trim()) {
            Alert.alert("Input Required", "Please enter some text or a URL to generate a QR code.");
            return;
        }
        setQrValue(text);
        Keyboard.dismiss();
    };

    const downloadQRCode = async () => {
        try {
            const uri = await captureRef(captureViewRef, {
                format: "png",
                quality: 1,
            });

            const directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;
            const filename = directory + "gen_qrcode.png";

            await FileSystem.copyAsync({
                from: uri,
                to: filename
            });

            Sharing.shareAsync(filename).catch(err => {
                Alert.alert("Error", "Sharing failed: " + err.message);
            });
        } catch (error: any) {
            Alert.alert("Error", "Failed to save/share image: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.headerTitle}>QR Generator</Text>
                        <Text style={styles.headerSubtitle}>Create custom QR codes instantly</Text>

                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.label}>CONTENT</Text>
                                    <TouchableOpacity onPress={pasteFromClipboard} style={styles.pasteButton}>
                                        <MaterialCommunityIcons name="content-paste" size={14} color="#4A90E2" />
                                        <Text style={styles.pasteText}>Paste</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                        placeholder="Enter text, URL, or message..."
                                        placeholderTextColor="#555"
                                        value={text}
                                        onChangeText={setText}
                                        multiline
                                        numberOfLines={3}
                                        blurOnSubmit
                                    />
                                    {text.length > 0 && (
                                        <TouchableOpacity onPress={() => setText('')} style={styles.clearButton}>
                                            <MaterialCommunityIcons name="close-circle" size={20} color="#555" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>CUSTOM MESSAGE (OPTIONAL)</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.inputSingle}
                                        placeholder="Add a title or label..."
                                        placeholderTextColor="#555"
                                        value={customMessage}
                                        onChangeText={setCustomMessage}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleGenerate}
                                style={styles.generateButton}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="qrcode-scan" size={22} color="#FFF" />
                                <Text style={styles.buttonText}>Generate Code</Text>
                            </TouchableOpacity>
                        </View>

                        {qrValue ? (
                            <View style={styles.resultSection}>
                                <View style={styles.divider} />

                                <View style={styles.resultCard}>
                                    <View ref={captureViewRef} style={styles.qrCaptureContainer} collapsable={false}>
                                        {customMessage ? (
                                            <Text style={styles.customMessageText}>{customMessage}</Text>
                                        ) : null}
                                        <QRCode
                                            value={qrValue}
                                            size={220}
                                            backgroundColor="white"
                                            color="black"
                                            getRef={(ref) => (qrRef.current = ref)}
                                        />
                                    </View>

                                    <Text style={styles.successText}>QR Code Ready!</Text>

                                    <TouchableOpacity
                                        onPress={downloadQRCode}
                                        style={styles.shareButton}
                                        activeOpacity={0.8}
                                    >
                                        <MaterialCommunityIcons name="share-variant" size={20} color="#FFF" />
                                        <Text style={styles.shareButtonText}>Share QR Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <MaterialCommunityIcons name="qrcode-edit" size={60} color="#333" />
                                <Text style={styles.placeholderText}>Your generated QR will appear here</Text>
                            </View>
                        )}

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 30,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#AAA',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    pasteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(74, 144, 226, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pasteText: {
        color: '#4A90E2',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    inputSingle: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#FFFFFF',
    },
    clearButton: {
        padding: 8,
        marginTop: 4,
    },
    generateButton: {
        flexDirection: 'row',
        backgroundColor: '#4A90E2',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 10,
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    resultSection: {
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#333',
        marginBottom: 30,
    },
    resultCard: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    qrCaptureContainer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
        minWidth: 260,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    customMessageText: {
        marginBottom: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    successText: {
        fontSize: 18,
        color: '#FFF',
        marginBottom: 20,
        fontWeight: '600',
    },
    shareButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 14,
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    shareButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        opacity: 0.4,
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
});

export default Generator;