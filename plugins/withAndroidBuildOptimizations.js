const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin to optimize Android build size
 * - Enables ProGuard/R8 minification
 * - Filters to arm64-v8a architecture only
 * - Enables resource shrinking
 */
const withAndroidBuildOptimizations = (config) => {
    // Add gradle properties for optimization
    config = withGradleProperties(config, (config) => {
        config.modResults.push({
            type: 'property',
            key: 'android.enableR8.fullMode',
            value: 'true',
        });
        return config;
    });

    // Modify app/build.gradle for architecture filtering and ProGuard
    config = withAppBuildGradle(config, (config) => {
        let buildGradle = config.modResults.contents;

        // Add ndk abiFilters in defaultConfig if not already present
        if (!buildGradle.includes('abiFilters')) {
            buildGradle = buildGradle.replace(
                /defaultConfig\s*{/,
                `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`
            );
        }

        // Enable minification and shrinking in release builds
        if (!buildGradle.includes('minifyEnabled true')) {
            buildGradle = buildGradle.replace(
                /release\s*{/,
                `release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'`
            );
        }

        config.modResults.contents = buildGradle;
        return config;
    });

    return config;
};

module.exports = withAndroidBuildOptimizations;
