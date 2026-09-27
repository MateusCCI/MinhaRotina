import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DatabaseSingleton from '../../../src/lib/database';
import { theme, statusColor, cardShadow } from '../../../src/lib/theme';

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
  const [ajustesRecentes, setAjustesRecentes] = useState<{ id: number; texto: string; created_at: string }[]>([]);

  useEffect(() => {
    loadStats();
    loadAjustes();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Revisão</Text>
        <Text style={styles.subtitle}>Olhe para trás com carinho, ajuste com calma</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroCard}>
            <Text style={styles.heroPct} accessibilityLabel={`Progresso de hoje ${progresso} por cento`}>
              <Text style={{ color: corProgresso }}>{progresso}%</Text>
            </Text>
            <Text style={styles.heroLabel}>
              {progresso >= 100
                ? 'Dia completo. Orgulhe-se.'
                : progresso >= 67
                  ? 'Muito bem — reta final.'
                  : progresso > 0
                    ? 'Começo feito, continue no seu ritmo.'
                    : 'Um dia de cada vez. Comece por uma prioridade.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo da semana</Text>

            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Ionicons name="file-tray-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Dias com inbox zerado</Text>
              <Text style={styles.statValue}>{stats.inboxZerado}/7</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statIcon}>
                <Ionicons name="exit-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Saídas registradas</Text>
              <Text style={styles.statValue}>{stats.totalSaidas}</Text>
            </View>

            <View style={[styles.statRow, styles.statRowLast]}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statLabel}>Horário médio de saída</Text>
              <Text style={styles.statValue}>{stats.mediaSaida}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajuste da semana</Text>
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
              <Text style={styles.btnSalvarText}>Guardar ajuste</Text>
            </TouchableOpacity>
          </View>

          {ajustesRecentes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ajustes anteriores</Text>
              {ajustesRecentes.map((item, idx) => (
                <View key={item.id} style={[styles.ajusteRow, idx === ajustesRecentes.length - 1 && styles.ajusteRowLast]}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} />
                  <Text style={styles.ajusteItem}>{item.texto}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.type.largeTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
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
  heroLabel: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...cardShadow(1),
  },
  sectionTitle: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
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
    backgroundColor: theme.colors.primarySoft,
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
    backgroundColor: theme.colors.primary,
    minHeight: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
});
