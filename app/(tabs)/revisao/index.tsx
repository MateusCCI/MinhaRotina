import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../../../src/components/ScreenShell';
import StatCard from '../../../src/components/StatCard';
import DatabaseSingleton from '../../../src/lib/database';
import { setSessionUser } from '../../../src/lib/session';
import { accents, statusColor, theme, cardShadow } from '../../../src/lib/theme';

const REVISAO = accents.revisao;

export default function RevisaoScreen() {
  const [stats, setStats] = useState({
    inboxZerado: 0,
    totalSaidas: 0,
    mediaSaida: '--:--',
    totalHoje: 0,
    completosHoje: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ajuste, setAjuste] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [ajustesRecentes, setAjustesRecentes] = useState<{ id: number; texto: string; created_at: string }[]>([]);

  useEffect(() => {
    loadStats();
    loadAjustes();
    loadUser();
  }, []);

  const loadAjustes = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      setAjustesRecentes(await db.getRecentAjustes());
    } catch (error) {
      console.error('Erro ao buscar ajustes:', error);
    }
  };

  const loadStats = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const weekly = await db.getWeeklyStats();
      const hojeItems = await db.getHojeItems();
      setStats(prev => ({
        ...prev,
        inboxZerado: weekly.inboxZerado,
        totalSaidas: weekly.totalSaidas,
        mediaSaida: weekly.mediaSaida,
        totalHoje: hojeItems.length,
        completosHoje: hojeItems.filter(i => i.checked).length,
      }));
    } catch {
      setStats(prev => ({ ...prev, inboxZerado: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const progresso = stats.totalHoje > 0
    ? Math.round((stats.completosHoje / Math.max(stats.totalHoje, 1)) * 100)
    : 0;
  const corProgresso = statusColor(progresso);

  const loadUser = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const id = await db.getActiveUserId();
      if (id !== null) {
        const user = await db.getUserById(id);
        setUserName(user?.name ?? null);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.setActiveUserId(null);
      setSessionUser(null);
    } catch {
      Alert.alert('Ops', 'Não consegui trocar de perfil. Tente de novo.');
    }
  };

  const handleSalvar = async (): Promise<void> => {
    if (!ajuste.trim()) {
      Alert.alert('Quase lá', 'Escreva uma linha sobre o que ajustar na próxima semana.');
      return;
    }
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.saveAjuste(ajuste.trim());
      await loadAjustes();
      Alert.alert('Registrado', 'Seu ajuste foi guardado. Até a próxima revisão.', [
        { text: 'OK', onPress: () => setAjuste('') },
      ]);
    } catch {
      Alert.alert('Ops', 'Não consegui salvar o ajuste. Tente de novo.');
    }
  };

  const estado =
    progresso >= 100
      ? 'Dia completo. Orgulhe-se.'
      : progresso >= 67
        ? 'Muito bem — reta final.'
        : progresso > 0
          ? 'Começo feito, continue no seu ritmo.'
          : 'Um dia de cada vez. Comece por uma prioridade.';

  return (
    <ScreenShell
      accent="revisao"
      icon="bar-chart"
      label="Revisão"
      headline="Olhe para trás"
      state={estado}
      stats={
        <>
          <StatCard icon="file-tray" value={`${stats.inboxZerado}/7`} label="dias zerados" />
          <StatCard icon="exit" value={String(stats.totalSaidas)} label="saídas" />
          <StatCard icon="time-outline" value={stats.mediaSaida} label="horário médio" />
        </>
      }
      loading={loading}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.heroPct} accessibilityLabel={`Progresso de hoje ${progresso} por cento`}>
            <Text style={{ color: corProgresso }}>{progresso}%</Text>
          </Text>
          <View style={styles.heroTrack}>
            <View style={[styles.heroFill, { width: `${progresso}%`, backgroundColor: corProgresso }]} />
          </View>
          <Text style={styles.heroLabel}>concluído hoje · {stats.completosHoje} de {stats.totalHoje} prioridades</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Ionicons name="bar-chart" size={15} color={REVISAO.base} />
            <Text style={styles.sectionTitle}>Resumo da semana</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statIcon}>
              <Ionicons name="file-tray-outline" size={20} color={REVISAO.base} />
            </View>
            <Text style={styles.statLabel}>Dias com inbox zerado</Text>
            <Text style={styles.statValue}>{stats.inboxZerado}/7</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statIcon}>
              <Ionicons name="exit-outline" size={20} color={REVISAO.base} />
            </View>
            <Text style={styles.statLabel}>Saídas registradas</Text>
            <Text style={styles.statValue}>{stats.totalSaidas}</Text>
          </View>

          <View style={[styles.statRow, styles.statRowLast]}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={20} color={REVISAO.base} />
            </View>
            <Text style={styles.statLabel}>Horário médio de saída</Text>
            <Text style={styles.statValue}>{stats.mediaSaida}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Ionicons name="create-outline" size={15} color={REVISAO.base} />
            <Text style={styles.sectionTitle}>Ajuste da semana</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Uma coisa para melhorar na próxima semana…"
            placeholderTextColor={theme.colors.textMuted}
            value={ajuste}
            onChangeText={setAjuste}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
            <Ionicons name="checkmark" size={20} color={theme.colors.onPrimary} />
            <Text style={styles.btnSalvarText}>Guardar ajuste</Text>
          </TouchableOpacity>
        </View>

        {ajustesRecentes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Ionicons name="time-outline" size={15} color={REVISAO.base} />
              <Text style={styles.sectionTitle}>Ajustes anteriores</Text>
            </View>
            {ajustesRecentes.map((item, idx) => (
              <View key={item.id} style={[styles.ajusteRow, idx === ajustesRecentes.length - 1 && styles.ajusteRowLast]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} />
                <Text style={styles.ajusteItem}>{item.texto}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Ionicons name="person-outline" size={15} color={REVISAO.base} />
            <Text style={styles.sectionTitle}>Perfil</Text>
          </View>
          <View style={styles.profileRow}>
            <View style={styles.statIcon}>
              <Ionicons name="person-outline" size={20} color={REVISAO.base} />
            </View>
            <Text style={styles.statLabel}>{userName ?? 'Sem nome'}</Text>
            <TouchableOpacity onPress={handleLogout} accessibilityLabel="Trocar de perfil" style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Trocar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 24,
    gap: 16,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...cardShadow(),
  },
  heroPct: {
    fontSize: 56,
    fontWeight: '800',
  },
  heroTrack: {
    width: '100%',
    height: 10,
    marginTop: 14,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 5,
    overflow: 'hidden',
  },
  heroFill: {
    height: '100%',
    borderRadius: 5,
    minWidth: 4,
  },
  heroLabel: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...cardShadow(1),
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: REVISAO.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
  },
  statValue: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.text,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
    minHeight: 88,
    marginBottom: 12,
  },
  btnSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: REVISAO.base,
    minHeight: 52,
    borderRadius: theme.radius.md,
  },
  btnSalvarText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  ajusteRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  ajusteRowLast: {
    borderBottomWidth: 0,
  },
  ajusteItem: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
    lineHeight: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  logoutBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logoutText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: REVISAO.base,
  },
});
