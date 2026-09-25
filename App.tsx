import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import Inbox from './app/(tabs)/inbox';
import Hoje from './app/(tabs)/hoje';
import Saida from './app/(tabs)/saida';
import Timer from './app/(tabs)/timer';
import Revisao from './app/(tabs)/revisao';
import DatabaseSingleton from './src/lib/database';
import { theme } from './src/lib/theme';
import { subscribeInboxCount } from './src/lib/inboxCount';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const [inboxCount, setInboxCount] = useState(0);

  useEffect(() => subscribeInboxCount(setInboxCount), []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const icons: Record<string, string> = {
            Inbox: focused ? '📥' : '📤',
            Hoje: focused ? '🎯' : '📋',
            Saida: focused ? '🚪' : '🚶',
            Timer: focused ? '⏱️' : '⏰',
            Revisao: focused ? '📊' : '📈',
          };
          return <Text style={{ fontSize: size }}>{icons[route.name] || '•'}</Text>;
        },
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerShown: false,
        tabBarBadge: route.name === 'Inbox' && inboxCount > 0 ? inboxCount : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.colors.gold,
          color: theme.colors.onGold,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Hoje" component={Hoje} />
      <Tab.Screen name="Saida" component={Saida} options={{ title: 'Saída' }} />
      <Tab.Screen name="Timer" component={Timer} />
      <Tab.Screen name="Revisao" component={Revisao} options={{ title: 'Revisão' }} />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.bg,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    primary: theme.colors.gold,
  },
};

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    DatabaseSingleton.getInstance()
      .then(db => db.init())
      .then(() => {
        setReady(true);
      })
      .catch(console.error);
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
});