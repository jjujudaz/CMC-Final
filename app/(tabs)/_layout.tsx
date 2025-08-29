
import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import drawerNavigation from './drawerNavigation';
import Notifications from './notifications';
import Cybermatch from '../cybermatch';
import Profile from './profile';
import Friends from './friends';

const Tab = createBottomTabNavigator();

export default function tabsNavigation() {
    return (
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={drawerNavigation}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />,
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    headerShown:false,
                    tabBarIcon: ({ color }) => <Feather size={28} name="inbox" color={color} />,
                }}
            />
            <Tab.Screen
                name="Friends"
                component={Friends}
                options={{
                    headerShown:false,
                    tabBarIcon: ({ color }) => <Feather size={28} name="coffee" color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown:false,
                    tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
                }}
            />

        </Tab.Navigator>
    );
}
