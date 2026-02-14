import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  if (!permission) {
    return <SafeAreaView style={styles.container} />;
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScannedData(data);
    setIsScanning(false);
  };

  const copyToClipboard = async () => {
    if (scannedData) {
      await Clipboard.setStringAsync(scannedData);
      Alert.alert("Success", "Copied to clipboard!");
    }
  };

  const openLink = async () => {
    if (scannedData) {
      try {
        const supported = await Linking.canOpenURL(scannedData);
        if (supported) {
          await Linking.openURL(scannedData);
        } else {
          Alert.alert("Error", "Cannot open this link: " + scannedData);
        }
      } catch (err) {
        // Alert.alert("Error", "An error occurred while trying to open the link.");
      }
    }
  };

  const isUrl = (text: string | null) => {
    if (!text) return false;
    return (
      text.startsWith("http://") ||
      text.startsWith("https://") ||
      text.startsWith("www.") ||
      text.startsWith("mailto:")
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Attempt to scan using the legacy Camera module from expo-camera
        // This avoids needing the standalone expo-barcode-scanner native module if expo-camera is already built.

        if (Camera && Camera.scanFromURLAsync) {
          const scannedResults = await Camera.scanFromURLAsync(result.assets[0].uri, ["qr"]);

          if (scannedResults.length > 0) {
            const { data } = scannedResults[0];
            setScannedData(data);
            setIsScanning(false);
            Alert.alert("Success", "QR Code found in image!");
          } else {
            Alert.alert("No QR Code", "Could not find a valid QR code in the selected image.");
          }
        } else {
          // Fallback explanation if the legacy API is gone
          Alert.alert(
            "Feature Unavailable",
            "Scanning from gallery requires a native build update. Please look for 'Rebuild' options or continue using the camera."
          );
        }
      }
    } catch (E: any) {
      console.log(E);
      Alert.alert("Error", "Failed to scan image: " + (E.message || "Unknown error"));
    }
  };

  if (isScanning) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar barStyle="light-content" translucent />
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scannedData && !isScanning ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Visual Overlay for Scanning Area */}
        <View style={styles.scanOverlay}>
          <View style={styles.overlayRow}>
            <View style={styles.overlayBlur} />
          </View>
          <View style={styles.middleRow}>
            <View style={styles.overlayBlur} />
            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
            <View style={styles.overlayBlur} />
          </View>
          <View style={styles.overlayRow}>
            <View style={styles.overlayBlur} />
          </View>
        </View>

        <SafeAreaView style={styles.overlayUI}>
          <Text style={styles.scanInstruction}>Align QR code within the frame</Text>

          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.controlButton}>
              <MaterialCommunityIcons name="image-outline" size={28} color="#FFF" />
              <Text style={styles.controlLabel}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsScanning(false)} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={32} color="#000" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>QR Scanner</Text>

      {scannedData ? (
        <View style={styles.resultContainer}>
          <MaterialCommunityIcons name="check-circle-outline" size={60} color="#4CD964" style={{ marginBottom: 20 }} />
          <Text style={styles.resultLabel}>Scanned Content:</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText} numberOfLines={4}>{scannedData}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={copyToClipboard} style={[styles.button, styles.copyButton]}>
              <MaterialCommunityIcons name="content-copy" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>

            {isUrl(scannedData) && (
              <TouchableOpacity onPress={openLink} style={[styles.button, styles.openButton]}>
                <MaterialCommunityIcons name="open-in-new" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Open</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              setScannedData(null);
              setIsScanning(true);
            }}
            style={[styles.button, styles.scanButton, { marginTop: 20, width: "100%" }]}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="qrcode-scan" size={100} color="#4A90E2" />
          </View>
          <Text style={styles.instructionText}>Position the QR code within the frame to scan.</Text>

          {!permission.granted ? (
            <TouchableOpacity
              onPress={requestPermission}
              style={[styles.button, styles.permissionButton]}
            >
              <Text style={styles.buttonText}>Allow Camera Access</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setScannedData(null);
                setIsScanning(true);
              }}
              style={[styles.button, styles.scanButton]}
            >
              <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Start Scanning</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  overlayRow: {
    flex: 1,
  },
  middleRow: {
    flexDirection: 'row',
    height: 280, // Size of the scan frame
  },
  overlayBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderColor: 'transparent', // Corners define the border
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderColor: '#4A90E2',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderColor: '#4A90E2',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderColor: '#4A90E2',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderColor: '#4A90E2',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  overlayUI: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: 40,
    alignItems: 'center',
  },
  scanInstruction: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 60,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  controlLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 1,
  },
  startContainer: {
    width: "100%",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#8E8E93", // Grey
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#1E1E1E", // Card Background
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  resultContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#1E1E1E", // Card Background
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  resultLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultBox: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

  },
  permissionButton: {
    backgroundColor: "#4A90E2",
    width: "100%",
  },
  scanButton: {
    backgroundColor: "#4A90E2", // Modern Blue
    width: "100%",
    flex: 0,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  copyButton: {
    backgroundColor: "#323232", // Dark Grey Button
  },
  openButton: {
    backgroundColor: "#5856D6", // Purple
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
