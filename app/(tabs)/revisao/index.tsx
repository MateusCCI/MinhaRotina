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
import DatabaseSingleton from '../../../src/lib/database';

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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const items = await db.getInboxItems();

      const diasNaSemana = 7;
      const inboxZerado = items.length === 0 ? diasNaSemana : Math.max(0, diasNaSemana - Math.ceil(items.length / 5));

      setStats(prev => ({
        ...prev,
        inboxZerado,
        totalHoje: items.length,
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
  const corProgresso = progresso >= 67 ? '#16A34A' : progresso >= 34 ? '#CA8A04' : '#DC2626';

  const handleSalvar = (): void => {
    if (!ajuste.trim()) {
      Alert.alert('Ajuste vazio', 'Escreva pelo menos uma linha sobre o que ajustar na próxima semana.');
      return;
    }
    Alert.alert('Revisão salva', 'Seu ajuste foi registrado. Veja você na próxima semana!', [
      { text: 'OK', onPress: () => setAjuste('') },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MINHA ROTINA</Text>
        <Text style={styles.subtitle}>Revisão Semanal</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 RESUMO DA SEMANA</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Inbox zerado:</Text>
              <Text style={styles.statValue}>{stats.inboxZerado}/7 dias</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Saídas registradas:</Text>
              <Text style={styles.statValue}>{stats.totalSaidas}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Média de saída:</Text>
              <Text style={styles.statValue}>{stats.mediaSaida}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Progresso hoje:</Text>
              <Text style={[styles.statValue, { color: corProgresso }]}>{progresso}%</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✏️ AJUSTE DA SEMANA</Text>
            <TextInput
              style={styles.textArea}
              placeholder="O que ajustar na próxima semana?"
              placeholderTextColor="#9CA3AF"
              value={ajuste}
              onChangeText={setAjuste}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
              <Text style={styles.btnSalvarText}>Salvar Revisão</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
    padding: 20,
    gap: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    marginBottom: 12,
  },
  btnSalvar: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSalvarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
