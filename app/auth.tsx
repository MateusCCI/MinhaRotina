import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../src/components/Logo';
import DatabaseSingleton from '../src/lib/database';
import { setSessionUser } from '../src/lib/session';
import { hashPassword, verifyPassword, normalizeEmail, isValidEmail } from '../src/lib/password';
import { accents, bandColor, theme, cardShadow } from '../src/lib/theme';

type Mode = 'login' | 'register';

const MIN_PASSWORD = 4;

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Campos com `returnKeyType="next"` precisam de ref para levar o foco ao
   * próximo: sem isso a tecla só fechava o teclado e a pessoa recomeçava a
   * procurar o campo à mão.
   */
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const switchMode = (next: Mode): void => {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const enterSession = async (userId: number): Promise<void> => {
    const db = await DatabaseSingleton.getInstance();
    await db.setActiveUserId(userId);
    setSessionUser(userId);
  };

  const handleLogin = async (): Promise<void> => {
    // O botão desabilita sozinho, mas `onSubmitEditing` do teclado não passa
    // por isso: sem a guarda, Enter no campo de senha criava duas sessões.
    if (busy) return;
    const mail = normalizeEmail(email);
    if (!isValidEmail(mail)) {
      setError('Confira o e-mail — parece estar incompleto.');
      return;
    }
    if (password.length === 0) {
      setError('Digite sua senha para entrar.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const db = await DatabaseSingleton.getInstance();
      const user = await db.findUserByEmail(mail);
      if (!user || !user.salt || !user.password_hash) {
        setError('Não achei esse e-mail. Quer criar uma conta?');
        return;
      }
      const ok = await verifyPassword(password, user.salt, user.password_hash);
      if (!ok) {
        setError('Senha incorreta. Tente de novo.');
        return;
      }
      await enterSession(user.id);
    } catch {
      setError('Não consegui entrar. Tente de novo.');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (busy) return;
    const trimmedName = name.trim();
    const mail = normalizeEmail(email);
    if (trimmedName.length < 2) {
      setError('Me diga seu nome (2 letras no mínimo).');
      return;
    }
    if (!isValidEmail(mail)) {
      setError('Confira o e-mail — parece estar incompleto.');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`A senha precisa de pelo menos ${MIN_PASSWORD} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Confira os dois campos.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { salt, hash } = await hashPassword(password);
      const db = await DatabaseSingleton.getInstance();
      const id = await db.createUserWithCredentials(trimmedName, mail, salt, hash);
      await enterSession(id);
    } catch (e) {
      if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
        setError('Esse e-mail já tem conta. Entre em vez de cadastrar.');
        return;
      }
      setError('Não consegui criar sua conta. Tente de novo.');
    } finally {
      setBusy(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bandColor(accents.inbox) }]} edges={['top']}>
      {/* A faixa verde é a mesma família do Inbox: o app já começa falando
          a língua de cor que o usuário vai ver nas abas. */}
      <StatusBar style="light" />
      <LinearGradient
        colors={accents.inbox.band}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.band}
      >
        <Logo layout="stack" slogan tone="band" />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}</Text>
          <Text style={styles.cardSub}>
            {isLogin
              ? 'Entre com seu e-mail e senha.'
              : 'Só nome, e-mail e senha. Seus dados ficam no aparelho.'}
          </Text>

          {!isLogin && (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Como posso te chamar?"
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="next"
                maxLength={30}
                autoCapitalize="words"
                accessibilityLabel="Seu nome"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="voce@exemplo.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Seu e-mail"
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={isLogin ? handleLogin : handleRegister}
              placeholder={isLogin ? 'Sua senha' : `Mínimo ${MIN_PASSWORD} caracteres`}
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              accessibilityLabel="Sua senha"
              ref={passwordRef}
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowPassword(v => !v)}
              accessibilityLabel={showPassword ? 'Esconder senhas' : 'Mostrar senhas'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <>
              <Text style={styles.label}>Repetir senha</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onSubmitEditing={handleRegister}
                placeholder="Digite a senha de novo"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                accessibilityLabel="Repita a senha"
              />
            </>
          )}

          {error && (
            <View
              style={styles.errorBox}
              // Sem isto o erro aparecia em silêncio para quem navega por
              // leitor de tela: o foco continuava no campo e nada era lido.
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
            >
              <Ionicons name="alert-circle-outline" size={18} color={theme.colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.cta, busy && styles.ctaBusy]}
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.ctaText}>{isLogin ? 'Entrar' : 'Criar conta'}</Text>
                <Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switch}
            onPress={() => switchMode(isLogin ? 'register' : 'login')}
          >
            <Text style={styles.switchText}>
              {isLogin ? 'Não tenho conta — criar agora' : 'Já tenho conta — entrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  band: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.xl,
    gap: 28,
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
  label: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: theme.type.body,
    color: theme.colors.text,
    minHeight: 52,
  },
  eye: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.dangerSoft,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: theme.type.footnote,
    color: theme.colors.dangerText,
    lineHeight: 20,
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
  ctaBusy: {
    opacity: 0.7,
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
