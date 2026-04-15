import React, { useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    StyleSheet, 
    Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { PlatformConfig, COUNTRY_CODES } from './social-config';
import { QRResult } from './QRResult';
import { SocialMode } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PlatformPageProps {
    config: PlatformConfig;
    fields: Record<string, string>;
    qrValue: string;
    onUpdateField: (key: string, value: string) => void;
    onGenerate: () => void;
    onShare: () => void;
    onSave: () => void;
    captureRef: React.RefObject<any>;
    qrRef: React.RefObject<any>;
}

export const PlatformPage: React.FC<PlatformPageProps> = ({
    config,
    fields,
    qrValue,
    onUpdateField,
    onGenerate,
    onShare,
    onSave,
    captureRef,
    qrRef,
}) => {
    const internalScrollRef = useRef<ScrollView>(null);

    return (
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <ScrollView
                ref={internalScrollRef}
                contentContainerStyle={styles.pageContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.cardGlass} />
                    <View style={styles.cardContent}>
                        
                        {/* Dynamic Fields */}
                        {config.fields.map((field) => (
                            <React.Fragment key={field.key}>
                                <Text style={[styles.sectionTitle, { marginTop: config.fields.indexOf(field) === 0 ? 0 : 16 }]}>
                                    <MaterialCommunityIcons name={field.icon as any} size={14} color="#A0A0FF" /> {field.label}
                                </Text>
                                <View style={[styles.inputRow, field.multiline && { height: 100, alignItems: 'flex-start' }]}>
                                    <TextInput
                                        style={[styles.input, field.multiline && { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                                        placeholder={field.placeholder}
                                        placeholderTextColor="#888"
                                        value={fields[field.key] || ''}
                                        onChangeText={(val) => onUpdateField(field.key, val)}
                                        keyboardType={field.keyboardType || 'default'}
                                        autoCapitalize={field.autoCapitalize || 'sentences'}
                                        multiline={field.multiline}
                                    />
                                    {!field.multiline && (fields[field.key]?.length > 0) && (
                                        <TouchableOpacity onPress={() => onUpdateField(field.key, '')} style={styles.clearBtn}>
                                            <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </React.Fragment>
                        ))}

                        {/* Special Case: WhatsApp Country Code Picker */}
                        {config.id === 'whatsapp' && (
                            <>
                                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                                    <MaterialCommunityIcons name="earth" size={14} color="#A0A0FF" /> COUNTRY CODE
                                </Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={fields.countryCode || '91'}
                                        onValueChange={(val) => onUpdateField('countryCode', val)}
                                        style={styles.picker}
                                        dropdownIconColor="#FFF"
                                        mode="dropdown"
                                    >
                                        {COUNTRY_CODES.map((c) => (
                                            <Picker.Item key={c.value} label={c.label} value={c.value} color="#000" />
                                        ))}
                                    </Picker>
                                </View>
                            </>
                        )}

                        {/* Common Custom Message Field */}
                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                            <MaterialCommunityIcons name="message-text" size={14} color="#F093FB" /> CUSTOM MESSAGE (OPTIONAL)
                        </Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a label..."
                                placeholderTextColor="#888"
                                value={fields.customMessage || ''}
                                onChangeText={(val) => onUpdateField('customMessage', val)}
                            />
                            {(fields.customMessage?.length > 0) && (
                                <TouchableOpacity onPress={() => onUpdateField('customMessage', '')} style={styles.clearBtn}>
                                    <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Generate Button (The missing piece in WhatsApp!) */}
                        <TouchableOpacity onPress={onGenerate} activeOpacity={0.9} style={{ marginTop: 20 }}>
                            <LinearGradient 
                                colors={config.gradient} 
                                start={{ x: 0, y: 0 }} 
                                end={{ x: 1, y: 1 }} 
                                style={styles.generateBtn}
                            >
                                <MaterialCommunityIcons name={config.generateIcon as any} size={22} color="#FFF" />
                                <Text style={styles.generateBtnText}>{config.generateLabel}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* QR Result */}
                {qrValue ? (
                    <QRResult 
                        qrValue={qrValue}
                        captureViewRef={captureRef}
                        qrRef={qrRef}
                        label={config.label}
                        customMessage={fields.customMessage || ''}
                        onShare={onShare}
                        onSave={onSave}
                    />
                ) : null}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    cardGlass: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    cardContent: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        letterSpacing: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        paddingHorizontal: 15,
        height: 56,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    clearBtn: {
        padding: 5,
    },
    pickerWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
    },
    picker: {
        height: 56,
        color: '#333',
    },
    generateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 18,
        gap: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    generateBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
