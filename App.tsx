import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Inbox from './app/(tabs)/inbox';
import Hoje from './app/(tabs)/hoje';
import Saida from './app/(tabs)/saida';
import Timer from './app/(tabs)/timer';
import Revisao from './app/(tabs)/revisao';
import AuthScreen from './app/auth';
import DatabaseSingleton from './src/lib/database';
import { theme } from './src/lib/theme';
import { subscribeInboxCount } from './src/lib/inboxCount';
import { getSessionUser, setSessionUser, subscribeSession } from './src/lib/session';

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
  const [dbError, setDbError] = useState(false);
  const [userId, setUserId] = useState<number | null>(getSessionUser());
  const [authChecked, setAuthChecked] = useState(false);

  const initDb = (): void => {
    setDbError(false);
    DatabaseSingleton.getInstance()
      .then(db => db.init())
      .then(() => DatabaseSingleton.getInstance())
      .then(db => db.getActiveUserId())
      .then(id => {
        setSessionUser(id);
        setAuthChecked(true);
        setReady(true);
      })
      .catch(() => setDbError(true));
  };

  useEffect(initDb, []);
  useEffect(() => subscribeSession(setUserId), []);

  const handleRetry = (): void => {
    // Na web o lock do OPFS só libera recarregando a página (1 aba por vez).
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }
    setReady(false);
    initDb();
  };

  if (dbError) {
    return (
      <SafeAreaProvider>
        <View style={styles.loader}>
          <Text style={styles.errorTitle}>Banco preso em outra aba</Text>
          <Text style={styles.errorText}>
            O navegador só deixa uma aba usar o banco por vez. Feche as outras abas
            deste endereço e toque em recarregar.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryText}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!ready || !authChecked) {
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
          {userId === null ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : (
            <Stack.Screen name="Main" component={TabNavigator} />
          )}
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
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryBtn: {
    minHeight: 52,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
