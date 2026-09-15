import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Text } from 'react-native';
import Inbox from './(tabs)/inbox';
import Hoje from './(tabs)/hoje';
import Saida from './(tabs)/saida';
import Timer from './(tabs)/timer';
import Revisao from './(tabs)/revisao';
import DatabaseSingleton from '../src/lib/database';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const icons: Record<string, string> = {
            Inbox: focused ? '📥' : '📤',
            Hoje: focused ? '🎯' : '📋',
            Saida: focused ? '🚪' : '📤',
            Timer: focused ? '⏱️' : '⏲️',
            Revisao: focused ? '🔄' : '📝',
          };
          return <Text style={{ fontSize: size }}>{icons[route.name] || '•'}</Text>;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Hoje" component={Hoje} />
      <Tab.Screen name="Saida" component={Saida} />
      <Tab.Screen name="Timer" component={Timer} />
      <Tab.Screen name="Revisao" component={Revisao} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    DatabaseSingleton.getInstance()
      .then(db => db.init())
      .catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
