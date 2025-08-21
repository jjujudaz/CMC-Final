
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import drawerNavigation from './drawerNavigation';
import Notifications from './notifications';
import Cybermatch from './cybermatch';
import Profile from './profile';
import Login from '../login';

const Tab = createBottomTabNavigator();

export default function tabsNavigation() {
    return (
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={drawerNavigation}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="bell" color={color} />,
                }}
            />
            <Tab.Screen
                name="Cybermatch"
                component={Cybermatch}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                }}
            />
            <Tab.Screen
                name="Login"
                component={Login}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="sign-in" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
