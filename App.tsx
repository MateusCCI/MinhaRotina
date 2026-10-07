import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Hoje from './app/(tabs)/hoje';
import Saida from './app/(tabs)/saida';
import Timer from './app/(tabs)/timer';
import Revisao from './app/(tabs)/revisao';
import AuthScreen from './app/auth';
import DatabaseSingleton from './src/lib/database';
import { accents, theme } from './src/lib/theme';
import { subscribeInboxCount } from './src/lib/inboxCount';
import { getSessionUser, setSessionUser, subscribeSession } from './src/lib/session';
import { semNotificacaoDeSistema, moduloNotificacoes } from './src/lib/notificacoes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Com o app aberto, o aviso de fim de bloco **não** vira notificação: a folha
 * de conclusão dentro do app já informa o quanto do dia saiu e oferece a
 * próxima prioridade, que é informação melhor que uma faixa do sistema.
 * A notificação fica reservada para quando o app está em segundo plano — que
 * é justamente o caso em que a folha não existe.
 *
 * Registrado no escopo do módulo para valer uma vez só, antes de qualquer tela.
 * O carregamento é protegido: `expo-notifications` é nativo e não existe em
 * todo build (Expo Go pode não trazi-lo). Um `require` cru aqui derrubava o app
 * inteiro ANTES da primeira tela renderizar.
 */
const notifications = semNotificacaoDeSistema() ? null : moduloNotificacoes();
if (notifications) {
  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Nomes de ícone usados nas abas (subconjunto do Ionicons). */
type IconName =
  | 'sunny'
  | 'exit'
  | 'exit-outline'
  | 'timer'
  | 'timer-outline'
  | 'bar-chart'
  | 'bar-chart-outline'
  | 'ellipse-outline';

const TAB_ICONS: Record<string, IconName> = {
  Hoje: 'sunny',
  Saida: 'exit-outline',
  Timer: 'timer-outline',
  Revisao: 'bar-chart-outline',
};

const TAB_ICONS_FOCUSED: Record<string, IconName> = {
  Hoje: 'sunny',
  Saida: 'exit',
  Timer: 'timer',
  Revisao: 'bar-chart',
};

/**
 * Cada aba acende na tinta da sua família de cor (ver `accents`). É a
 * mesma informação que a faixa repete no topo — aqui ela responde "onde
 * eu estou" num relance, sem precisar ler o rótulo.
 */
const TAB_ACCENT: Record<string, keyof typeof accents> = {
  Hoje: 'inbox',
  Saida: 'saida',
  Timer: 'timer',
  Revisao: 'revisao',
};

function TabNavigator() {
  const [inboxCount, setInboxCount] = useState(0);

  useEffect(() => subscribeInboxCount(setInboxCount), []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const accent = accents[TAB_ACCENT[route.name] ?? 'inbox'];
        return {
          // `tabBarButtonTestID` e o nome certo no @react-navigation/
          // bottom-tabs. `tabBarTestID` pertence ao bottom-navigation
          // (Material) e aqui e simplesmente ignorado: o atributo nem chega
          // no DOM, e o Playwright volta a clicar no <div> de texto, que
          // fica atrás da aba vizinha.
          tabBarButtonTestID: `aba-${route.name}`,
          tabBarAccessibilityLabel: `Aba ${route.name}`,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              name={focused ? TAB_ICONS_FOCUSED[route.name] : TAB_ICONS[route.name] ?? 'ellipse-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor: accent.base,
          tabBarInactiveTintColor: theme.colors.textMuted,
          headerShown: false,
          // O contador é do Inbox: quantas ideias ainda esperam virar
          // prioridade do dia. Depois da fusão, ele mora na aba Hoje.
          tabBarBadge: route.name === 'Hoje' && inboxCount > 0 ? inboxCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: accent.base,
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
        };
      }}
    >
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
          <Text style={styles.errorTitle}>Fechar as outras abas</Text>
          <Text style={styles.errorText}>
            Este banco só pode estar aberto em uma aba por vez. Feche as outras abas
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
