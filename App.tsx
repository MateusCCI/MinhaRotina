import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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

/** Nomes de ícone usados nas abas (subconjunto do Ionicons). */
type IconName =
  | 'file-tray'
  | 'file-tray-outline'
  | 'sunny'
  | 'sunny-outline'
  | 'exit'
  | 'exit-outline'
  | 'timer'
  | 'timer-outline'
  | 'bar-chart'
  | 'bar-chart-outline'
  | 'ellipse-outline';

const TAB_ICONS: Record<string, IconName> = {
  Inbox: 'file-tray-outline',
  Hoje: 'sunny-outline',
  Saida: 'exit-outline',
  Timer: 'timer-outline',
  Revisao: 'bar-chart-outline',
};

const TAB_ICONS_FOCUSED: Record<string, IconName> = {
  Inbox: 'file-tray',
  Hoje: 'sunny',
  Saida: 'exit',
  Timer: 'timer',
  Revisao: 'bar-chart',
};

function TabNavigator() {
  const [inboxCount, setInboxCount] = useState(0);

  useEffect(() => subscribeInboxCount(setInboxCount), []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => (
          <Ionicons
            name={focused ? TAB_ICONS_FOCUSED[route.name] : TAB_ICONS[route.name] ?? 'ellipse-outline'}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerShown: false,
        tabBarBadge: route.name === 'Inbox' && inboxCount > 0 ? inboxCount : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.colors.primary,
          color: theme.colors.onPrimary,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
    primary: theme.colors.primary,
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
      <SafeAreaProvider>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
