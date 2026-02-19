# Social QR - Code Generator & Scanner 📱

A beautiful, privacy-focused QR code generator and scanner built with React Native and Expo. Create QR codes for social media profiles, URLs, emails, and more with stunning gradient UI and glassmorphic design.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)

## ✨ Features

### 🎨 Beautiful UI/UX
- **Modern Gradient Design**: Vibrant gradient backgrounds and glassmorphic cards
- **Dark Theme**: Eye-friendly dark interface with colorful accents
- **Smooth Animations**: Premium feel with shadow effects and transitions
- **Responsive Layout**: Optimized for all screen sizes

### 📱 Social QR Generation
Generate QR codes for multiple platforms:
- **WhatsApp**: Direct message links with country code support
- **Instagram**: Profile links
- **Twitter/X**: Profile links
- **LinkedIn**: Professional profile links
- **GitHub**: Developer profile links
- **Facebook**: Page/profile links
- **Email**: Pre-filled email composer with subject and body

### 🔧 Custom QR Generator
- Generate QR codes from any text or URL
- Add custom messages/labels to QR codes
- Support for multiple data types (URLs, text, email, etc.)

### 📷 QR Scanner
- **Real-time Scanning**: Fast and accurate QR code detection
- **Gallery Import**: Scan QR codes from existing images
- **Smart Detection**: Automatically recognizes URLs and offers to open them
- **Copy to Clipboard**: One-tap content copying

### 🔒 Privacy First
- **100% Local Processing**: All QR code generation happens on your device
- **No Data Collection**: We don't collect, store, or transmit any personal data
- **No Tracking**: No analytics or third-party trackers
- **Offline Capable**: Generate QR codes without internet connection

### 💾 Save & Share
- Save QR codes directly to your gallery
- Share QR code images instantly
- Custom album organization ("SocialQR" album)

---

## 🛠 Tech Stack

### **Core Framework**
- **[React Native](https://reactnative.dev/)** `0.81.5` - Cross-platform mobile development
- **[React](https://react.dev/)** `19.1.0` - UI library
- **[Expo](https://expo.dev/)** `~54.0.33` - Development platform and tooling
- **[TypeScript](https://www.typescriptlang.org/)** `~5.9.2` - Type-safe development

### **Navigation & Routing**
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `~6.0.23` - File-based routing
- **[React Navigation](https://reactnavigation.org/)** `^7.1.8` - Navigation library
  - Bottom Tabs `^7.4.0`
  - Navigation Elements `^2.6.3`

### **UI & Graphics**
- **[React Native SVG](https://github.com/software-mansion/react-native-svg)** `15.12.1` - SVG rendering
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** `~2.28.0` - Touch gestures
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** `~4.1.1` - Animations
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** `^15.0.8` - Gradient backgrounds
- **[@expo/vector-icons](https://icons.expo.fyi/)** `^15.0.3` - Icon library (Material Community Icons)
- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** `~5.6.0` - Safe area handling

### **QR Code Libraries**
- **[React Native QRCode SVG](https://github.com/awesomejerry/react-native-qrcode-svg)** `^6.3.21` - QR code generation
- **[React Native View Shot](https://github.com/gre/react-native-view-shot)** `4.0.3` - Capture QR as image

### **Camera & Media**
- **[Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)** `~17.0.10` - QR scanning
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** `~17.0.10` - Gallery access
- **[Expo Media Library](https://docs.expo.dev/versions/latest/sdk/media-library/)** `~18.2.1` - Save to gallery
- **[Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)** `~3.0.11` - Optimized image component

### **Device APIs**
- **[Expo Clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard/)** `~8.0.8` - Clipboard operations
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** `~19.0.21` - File management
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** `~14.0.8` - System share sheet
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** `~15.0.8` - Haptic feedback
- **[Expo Linking](https://docs.expo.dev/versions/latest/sdk/linking/)** `~8.0.11` - Deep linking

### **Additional Expo SDKs**
- **Expo Constants** `~18.0.13` - App constants
- **Expo Splash Screen** `~31.0.13` - Splash screen management
- **Expo Status Bar** `~3.0.9` - Status bar styling
- **Expo System UI** `~6.0.9` - System UI theming
- **Expo Font** `~14.0.11` - Custom fonts
- **Expo Symbols** `~1.0.8` - SF Symbols support

### **State & Storage**
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** `2.2.0` - Local storage
- **[@react-native-picker/picker](https://github.com/react-native-picker/picker)** `2.11.1` - Native picker component

### **Advanced Features**
- **[@shopify/react-native-skia](https://shopify.github.io/react-native-skia/)** `2.2.12` - High-performance graphics
- **[React Native Worklets](https://github.com/margelo/react-native-worklets-core)** `0.5.1` - JavaScript worklets

### **Build & Development**
- **[EAS Build](https://docs.expo.dev/build/introduction/)** - Cloud-based app building
- **[Expo Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)** `~6.0.20` - Custom development client
- **ESLint** `^9.25.0` - Code linting
- **Expo Router (TypedRoutes)** - Type-safe routing

### **Experimental Features Enabled**
- **React Compiler** - Automatic React optimizations
- **React Native New Architecture** - Modern rendering engine
- **Typed Routes** - Full TypeScript route support

---

## 📂 Project Structure

```
qr-code-generator/
├── app/                          # Main application code (Expo Router)
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx           # Tab layout configuration
│   │   ├── index.tsx             # Home screen (Social QR Generator)
│   │   ├── generator.tsx         # Custom QR Generator screen
│   │   └── scanner.tsx           # QR Scanner screen
│   └── _layout.tsx               # Root layout
├── assets/                       # Static assets
│   └── images/                   # App icons and images
│       ├── icon.png
│       ├── splash-icon.png
│       ├── android-icon-foreground.png
│       ├── android-icon-background.png
│       └── android-icon-monochrome.png
├── docs/                         # Documentation
│   └── PRIVACY_POLICY.md         # Privacy policy
├── android/                      # Native Android code (generated)
├── .eas/                         # EAS Build configuration
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI** (for builds): `npm install -g eas-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cntbabul/Social-QR-Generator-.git
   cd qr-code-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS (macOS only)
   - Scan QR code with Expo Go app (for quick testing)

### Development Builds

For full feature access (camera, media library), create a development build:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## 📱 Build for Production

### Using EAS Build (Recommended)

1. **Configure EAS**
   ```bash
   eas login
   eas build:configure
   ```

2. **Build APK (Android)**
   ```bash
   eas build --platform android --profile production
   ```

3. **Build AAB (Android - for Play Store/Indus AppStore)**
   ```bash
   eas build --platform android --profile production-aab
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```

### Build Profiles (eas.json)

- **development**: Development client with debugging
- **preview**: Internal testing APK
- **production**: Production APK build
- **production-aab**: Production AAB (Android App Bundle) for app stores

---

## 🔧 Configuration

### App Configuration (app.json)

Key settings:
- **Package ID**: `social.qr`
- **Version**: `1.0.0`
- **Orientation**: Portrait only
- **New Architecture**: Enabled
- **Adaptive Icon**: Custom Android icon with background/foreground

### Permissions

The app requests minimal permissions:
- **Camera**: For QR code scanning
- **Media Library**: To save generated QR codes
- **Storage**: For saving QR code images

### Android Permissions

```xml
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- READ_MEDIA_IMAGES
```

---

## 🎨 UI Design Philosophy

### Color Palette
- **Primary Gradients**: 
  - Purple to Pink: `#667EEA → #764BA2 → #F093FB`
  - Dark Background: `#0F0C29 → #302B63 → #24243E`
- **Social Platform Colors**:
  - WhatsApp: `#25D366`
  - Instagram: `#F58529 → #DD2A7B → #8134AF`
  - Twitter/X: `#1DA1F2`
  - LinkedIn: `#0077B5`
  - GitHub: `#333`
  - Facebook: `#1877F2`
  - Email: `#EA4335`

### Design Elements
- **Glassmorphism**: Frosted glass effect cards with backdrop blur
- **Elevated Shadows**: Multi-layer shadows for depth
- **Gradient Buttons**: Platform-specific gradient colors
- **Custom Typography**: Bold headings with letter spacing
- **Safe Areas**: Full support for notched devices

---

## 📸 Screenshots

### Social QR Generator
- Multi-platform QR generation (WhatsApp, Instagram, Twitter, LinkedIn, GitHub, Facebook, Email)
- Country code selector for WhatsApp
- Custom message support
- Live QR preview

### Custom Generator
- Free-form text/URL input
- Paste from clipboard support
- Custom label/title

### QR Scanner
- Real-time camera scanning
- Gallery image scanning
- Auto-detect URLs
- Copy to clipboard
- One-tap URL opening

---

## 🔐 Privacy & Security

This app is designed with **privacy-first principles**:

✅ **No Data Collection**: Zero personal data collected or transmitted
✅ **Local Processing**: All QR generation happens on-device
✅ **No Analytics**: No tracking or user behavior monitoring
✅ **No Third-Party SDKs**: Only essential Expo/React Native libraries
✅ **Minimal Permissions**: Only camera and storage (for saving QR codes)
✅ **Offline Capable**: Works without internet connection

See [PRIVACY_POLICY.md](./docs/PRIVACY_POLICY.md) for complete details.

---

## 🐛 Known Issues & Limitations

1. **Local Android Build**: Requires macOS/Linux for EAS local builds
2. **Camera Permissions**: Must grant camera access for scanning
3. **Gallery Scanning**: Requires native build (not available in Expo Go)

---

## 🛣 Roadmap

- [ ] iOS support and App Store deployment
- [ ] QR code customization (colors, logo embedding)
- [ ] Scan history with local storage
- [ ] Batch QR code generation
- [ ] vCard QR generation
- [ ] WiFi QR code support
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Solo Developer - cntbabul**
- Email: Cntbabul@gmail.com
- GitHub: [@cntbabul](https://github.com/cntbabul)

---

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev/) for the amazing development platform
- [React Native Community](https://reactnative.dev/) for the framework
- [Material Design Icons](https://materialdesignicons.com/) for the beautiful icons
- All open-source contributors whose libraries made this possible

---

## 📚 Useful Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Clean project
npm run reset-project

# Create production build (EAS)
eas build --platform android --profile production

# Preview build
eas build --platform android --profile preview
```

---

## 🔗 Links

- **Repository**: [GitHub - Social QR Generator](https://github.com/cntbabul/Social-QR-Generator-)
- **Expo Project**: [EAS Project ID: eccf06dd-086b-44d7-a4a9-4da7f1ef6ccb]
- **Privacy Policy**: [View Policy](./docs/PRIVACY_POLICY.md)

---

**Made with ❤️ using Expo and React Native**
