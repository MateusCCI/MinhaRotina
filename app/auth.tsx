import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../src/components/Logo';
import DatabaseSingleton from '../src/lib/database';
import { setSessionUser } from '../src/lib/session';
import { theme, cardShadow } from '../src/lib/theme';

type Mode = 'login' | 'register';

interface Profile {
  id: number;
  name: string;
}

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const users = await db.getUsers();
      setProfiles(users);
      if (users.length === 0) setMode('register');
    } catch {
      Alert.alert('Ops', 'Não consegui carregar os perfis. Tente de novo.');
    } finally {
      setLoading(false);
    }
  };

  const enterAs = async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.setActiveUserId(id);
      setSessionUser(id);
    } catch {
      Alert.alert('Ops', 'Não consegui entrar. Tente de novo.');
    }
  };

  const handleRegister = async (): Promise<void> => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      Alert.alert('Nome curto', 'Use pelo menos 2 letras para eu te chamar direito.');
      return;
    }
    try {
      const db = await DatabaseSingleton.getInstance();
      const id = await db.createUser(trimmed);
      await db.setActiveUserId(id);
      setSessionUser(id);
    } catch {
      Alert.alert('Ops', 'Não consegui criar seu perfil. Tente de novo.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Logo layout="stack" slogan />

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : mode === 'login' && profiles.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quem é você hoje?</Text>
            <Text style={styles.cardSub}>Toque no seu nome para continuar.</Text>
            {profiles.map(p => (
              <TouchableOpacity key={p.id} style={styles.profile} onPress={() => enterAs(p.id)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{p.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.profileName}>{p.name}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.switch} onPress={() => setMode('register')}>
              <Text style={styles.switchText}>Sou novo por aqui — criar perfil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {profiles.length === 0 ? 'Bem-vindo! Crie seu perfil' : 'Criar outro perfil'}
            </Text>
            <Text style={styles.cardSub}>Só o nome — sem senha, sem burocracia. Seus dados ficam no aparelho.</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              onSubmitEditing={handleRegister}
              placeholder="Como posso te chamar?"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="done"
              maxLength={30}
              accessibilityLabel="Seu nome"
            />
            <TouchableOpacity style={styles.cta} onPress={handleRegister}>
              <Text style={styles.ctaText}>Começar</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />
            </TouchableOpacity>
            {profiles.length > 0 && (
              <TouchableOpacity style={styles.switch} onPress={() => setMode('login')}>
                <Text style={styles.switchText}>Já tenho perfil — entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: 28,
  },
  loader: {
    marginTop: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...cardShadow(),
  },
  cardTitle: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
  },
  cardSub: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 20,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  profileName: {
    flex: 1,
    fontSize: theme.type.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    fontSize: theme.type.body,
    color: theme.colors.text,
    minHeight: 52,
    marginBottom: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  ctaText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  switch: {
    marginTop: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
