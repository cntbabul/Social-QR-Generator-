import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#4A90E2", // Modern Blue
                tabBarInactiveTintColor: "#8E8E93", // Grey
                tabBarStyle: {
                    backgroundColor: "#121212", // Dark Background
                    borderTopWidth: 0,
                    height: 60 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: insets.bottom + 8,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontWeight: "600",
                    fontSize: 12,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Social",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="whatsapp" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    title: "Scanner",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="generator"
                options={{
                    title: "Generator",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-plus" size={size} color={color} />,
                }}
            />

        </Tabs>

    )
}

export default TabLayout