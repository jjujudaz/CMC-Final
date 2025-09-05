import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Feather from '@expo/vector-icons/Feather';
import { View, Text } from "react-native";
import _layout from "@/app/_layout";
import home from "@/app/(tabs)/home";
import findmentors from "@/app/findmentors";
import settings from "@/app/settings";
import CyberMatchScreen from '../cybermatch';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: "#f9fafb",
                        borderTopRightRadius: 24,
                        borderBottomRightRadius: 24,
                        width: 260,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 4,
                    },
                    overlayColor: "rgba(211, 211, 211, 0.35)",
                    drawerActiveTintColor: "#2563eb",
                    drawerInactiveTintColor: "#222",
                    drawerActiveBackgroundColor: "#e0e7ff",
                    drawerLabelStyle: {
                        fontSize: 18,
                        fontWeight: "600",
                        marginLeft: -8,
                    },
                    drawerItemStyle: {
                        borderRadius: 12,
                        marginVertical: 4,
                    },
                }}
            >
                <Drawer.Screen name="Home Page" component={home}
                               options={{ headerShown: false,
                                   drawerActiveBackgroundColor: "#fbeaea",
                                   drawerActiveTintColor: "#f07e74",
                                   drawerIcon: ({ color, size }) => (
                                       <Feather name="home" size={size} color={color} />),

                }}
                />
                <Drawer.Screen name="Explore" component={findmentors}
                               options={{ headerShown: false,
                                   drawerActiveBackgroundColor: "#fbeaea",
                                   drawerActiveTintColor: "#f07e74",
                                   drawerIcon: ({ color, size }) => (
                                       <Feather name="search" size={24} color={color} />),

                               }}
                />
                <Drawer.Screen name="Cyber Match" component={CyberMatchScreen}
                               options={{ headerShown: false,
                                   drawerActiveBackgroundColor: "#fbeaea",
                                   drawerActiveTintColor: "#f07e74",
                                   drawerIcon: ({ color, size }) => (
                                       <Feather name="shield" size={24} color={color} />),
                               }}
                />
                <Drawer.Screen name="Settings" component={settings}
                               options={{ headerShown: false,
                                   drawerActiveBackgroundColor: "#fbeaea",
                                   drawerActiveTintColor: "#f07e74",
                                   drawerIcon: ({ color, size }) => (
                                       <Feather name="settings" size={24} color={color} />),
                               }}
                />
            </Drawer.Navigator>
        </GestureHandlerRootView>
    );
}